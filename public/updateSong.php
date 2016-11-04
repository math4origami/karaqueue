<?php
include_once "song.php";
include_once "yahooApplication.php";

function updateSong() {
  if (!isset($_GET["song_id"]) ||
      !isset($_POST["subtitles"])) {
    return false;
  }

  $song = Song::load((int)$_GET["song_id"]);
  if (!$song) {
    return false;
  }

  $song->subtitles = $_POST["subtitles"];
  $song->furigana = createFurigana($song->subtitles);
  $song->update();
  return true;
}

function createFurigana($subtitles) {
  $yahooApplication = new YahooApplication();
  $furigana = $yahooApplication->getFurigana($subtitles);
  return json_encode($furigana);
}

// Deprecated
function createMecabFurigana($subtitles) {
  $parsed = "";
  if (class_exists("Mecab_Tagger")) {
    $mecab = new Mecab_Tagger();
    $parsed = $mecab->parse($subtitles);
  } else if (stripos(PHP_OS, "WIN") === 0) {
    $path = 'C:/"Program Files (x86)"/MeCab/bin/mecab.exe';
    $descriptorSpec = array(
      array("pipe", "r"),
      array("pipe", "w")
    );
    $process = proc_open($path, $descriptorSpec, $pipes);
    if (is_resource($process)) {
      fwrite($pipes[0], $subtitles);
      fclose($pipes[0]);
      $parsed = stream_get_contents($pipes[1]);
      fclose($pipes[1]);
      proc_close($process);
    }
  }
  $tags = explode("\n", $parsed);
  $furigana = array();
  foreach ($tags as $tag) {
    $pair = explode("\t", $tag);
    if (count($pair) < 2) {
      continue;
    }
    $word = $pair[0];
    $terms = explode(",", $pair[1]);
    if (count($terms) < 9) {
      $term = "";
    } else {
      $term = mb_convert_kana($terms[7], "c");
    }
    if ($term == $word) {
      $term = "";
    }
    $furigana[] = array($word, $term);
  }
  return json_encode($furigana);
}

if (!updateSong()) {
  echo "Update song error";
} else {
  echo "Update song success";
}
