<?php
include_once "mysql.php";

function swap($queue, $i, $j, $mysqli) { 
  $id = $queue[$i]["id"];
  $index = $queue[$i]["queue_index"];
  $other = $queue[$j]["id"];
  $otherIndex = $queue[$j]["queue_index"]; error_log("$id $index, $other $otherIndex");
  $mysqli->query("UPDATE queued_song SET queue_index='-1' WHERE id=$id");
  $mysqli->query("UPDATE queued_song SET queue_index='$index' WHERE id=$other");
  $mysqli->query("UPDATE queued_song SET queue_index='$otherIndex' WHERE id=$id");
}

$queue_id = 3;
$result = $mysqli->query("SELECT * FROM queued_song WHERE queue_id=$queue_id ORDER BY queue_index");

$queue = array();
while ($row = $result->fetch_assoc()) {
  $queue[] = $row;
}

if (!isset($_GET["act"]) || !isset($_GET["id"])) {
  exit();
}

$act = $_GET["act"];
$id = $_GET["id"];
if ($act == "delete") {
  $mysqli->query("DELETE FROM queued_song WHERE id = $id");
} else if ($act == "raise") {
  for ($i=1; $i<count($queue); $i++) {
    if ($queue[$i]["id"] == $id) {
      swap($queue, $i, $i-1, $mysqli);
      break;
    }
  }
} else if ($act == "lower") {
  for ($i=0; $i<count($queue)-1; $i++) {
    if ($queue[$i]["id"] == $id) {
      swap($queue, $i, $i+1, $mysqli);
      break;
    }
  }
}


?>
