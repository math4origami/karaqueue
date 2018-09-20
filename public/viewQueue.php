<?php
include_once "mysql.php";
include_once "queueManager.php";
include_once "song.php";

$queueManager = new QueueManager();
$queue = $queueManager->getSearchQueue();

if ($queue) {
  $result = $mysqli->query("SELECT * FROM queued_song WHERE queue_id=$queue->id ORDER BY queue_index");

  $queue = array();
  while ($row = $result->fetch_assoc()) {
    $id = Id::encode($row["song_id"]);
    $row["song_id"] = $id->encoded;
    $song = Song::load($id->value);
    if ($song) {
      $row["subtitles"] = $song->subtitles;
      $row["furigana"] = $song->furigana;
    } else {
      $row["subtitles"] = "";
      $row["furigana"] = "";
    }

    $queue[] = $row;
  }

  echo json_encode($queue);
}
?>
