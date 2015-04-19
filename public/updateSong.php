<?php
include_once "song.php";

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
  echo $song->furigana;
  $song->update();
  return true;
}

function createFurigana($subtitles) {
  $mecab = new Mecab_Tagger();
  $parsed = $mecab->parse($subtitles);
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
  //echo "Update song success";
}
