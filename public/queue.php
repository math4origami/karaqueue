<?php
include_once "mysql.php";

$queueId = isset($_GET["queue_id"]) ? $_GET["queue_id"] : 0;
$result = $mysqli->query("SELECT * FROM queued_song WHERE queue_id=$queueId ORDER BY queue_index");

$queue = array();
while ($row = $result->fetch_assoc()) {
  $queue[] = $row;
}

echo json_encode($queue);
?>
