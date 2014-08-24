<?php
include_once "mysql.php";

$result = $mysqli->query("SELECT * FROM queued_song WHERE queue_id=0 ORDER BY queue_index");

$queue = array();
while ($row = $result->fetch_assoc()) {
  $queue[] = $row;
}

echo json_encode($queue);
?>
