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
  $song->update();
  return true;
}

if (!updateSong()) {
  echo "Update song error";
} else {
  echo "Update song success";
}
