<?php
include_once "mysql.php";

$queueId = 3;
$result = $mysqli->query("SELECT * FROM queued_song WHERE queue_id=$queueId ORDER BY queue_index");

$queue = array();
while ($row = $result->fetch_assoc()) {
  $queue[] = $row;
}

echo json_encode($queue);
?>
