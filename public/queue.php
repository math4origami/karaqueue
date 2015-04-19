<?php
include_once "mysql.php";
include_once "song.php";

$queueId = isset($_GET["queue_id"]) ? (int)$_GET["queue_id"] : 0;
$result = $mysqli->query("SELECT * FROM queued_song WHERE queue_id=$queueId ORDER BY queue_index");

$queue = array();
while ($row = $result->fetch_assoc()) {
  $song = Song::load($row["song_id"]);
  if ($song) {
    $row["subtitles"] = $song->subtitles;
    $row["furigana"] = $song->furigana;
  }

  $queue[] = $row;
}

echo json_encode($queue);
?>
