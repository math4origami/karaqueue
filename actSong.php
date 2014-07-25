<?php
include_once "mysql.php";

$result = $mysqli->query("SELECT * FROM queued_song WHERE queue_id=0 ORDER BY queue_index");

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
  $i=1;
  for (; $i<count($queue); $i++) {
    if ($queue[$i]["id"] == $id) {
      $other = $queue[$i-1]["id"];
      $otherName = $queue[$i-1]["name"];
      $name = $queue[$i]["name"];
      $mysqli->query("UPDATE queued_song SET name='$otherName' WHERE id=$id");
      $mysqli->query("UPDATE queued_song SET name='$name' WHERE id=$other");
    }
  }
} else if ($act == "lower") {
  $i=0;
  for (; $i<count($queue)-1; $i++) {
    if ($queue[$i]["id"] == $id) {
      $other = $queue[$i+1]["id"];
      $otherName = $queue[$i+1]["name"];
      $name = $queue[$i]["name"];
      $mysqli->query("UPDATE queued_song SET name='$otherName' WHERE id=$id");
      $mysqli->query("UPDATE queued_song SET name='$name' WHERE id=$other");
    }
  }
}


?>
