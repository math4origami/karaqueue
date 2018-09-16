<?php
include_once "mysql.php";
include_once "user.php";
include_once "song.php";

function getTypeName($type) {
  switch ($type) {
    case 0:
      return "NicoNicoDouga";
    case 1:
      return "Dam";
    case 2:
      return "Youtube";
    default:
      return "Unknown type";
  }
}

function addSong($type, $name) {
  global $mysqli;
  $name = $mysqli->escape_string($name);
  $user = User::load();
  $queueId = $user->queue_id;

  $result = $mysqli->query("SELECT * FROM queued_song WHERE queue_id=$queueId ORDER BY queue_index");
  $queue = array();
  $last = -1;
  while ($row = $result->fetch_assoc()) {
    $queue[] = $row;
    if ($row['queue_index'] > $last) {
      $last = $row['queue_index'];
    }
  }

  $song = Song::getSongByType($type, $name);

  $mysqli->query("INSERT INTO queued_song (queue_id, queue_index, song_id, type, name)
    VALUES ($queueId, " . ($last + 1) . ", " . $song->id . ", $type, '$name')");

  $typeName = getTypeName($type);
  echo "alert('Successfully added: `$name` from $typeName');";
}

$success = false;
if (isset($_GET["address"])) {
  $address = $_GET["address"];

  $parsed = parse_url($address);

  if (isset($parsed["host"])) {
    if (strpos($parsed["host"], "nicovideo.jp") !== false &&
        isset($parsed["path"])) {
      $tags = explode("/", $parsed["path"]);
      $name = $tags[count($tags) - 1];

      if (strpos($name, "sm") === 0 ||
          strpos($name, "nm") === 0) {
        addSong(0, $name);
        $success = true;
      }
    } else if (strpos($parsed["host"], "youtube.com") !== false &&
               isset($parsed["query"])) {
      $args = explode("&", $parsed["query"]);
      foreach ($args as $pair) {
        $tags = explode("=", $pair);
        if (count($tags) > 1 && $tags[0] == "v") {
          addSong(2, $tags[1]);
          $success = true;
        }
      }
    }
  }
} else if (isset($_GET["contentsId"]) &&
           isset($_GET["karaokeContentsId"]) &&
           isset($_GET["siteCode"])) {
  $damData = array(
    "contentsId" => $_GET["contentsId"],
    "karaokeContentsId" => $_GET["karaokeContentsId"],
    "siteCode" => $_GET["siteCode"]
  );

  if (isset($_GET["title"])) {
    $damData["title"] = $_GET["title"];
  }
  if (isset($_GET["artist"])) {
    $damData["artist"] = $_GET["artist"];
  }
  if (isset($_GET["duration"])) {
    $damData["duration"] = $_GET["duration"];
  }

  addSong(1, json_encode($damData, JSON_UNESCAPED_UNICODE));
  $success = true;
}

if (!$success) {
  echo "alert('Error, unable to add song.');";
}

?>
