<?php
include_once "../private/client.php";
include_once "../private/mysql.php";
include_once "../private/song.php";

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

function verifyYoutube($name) {
  return strlen($name) == 11 && preg_match("/^[\w-_]*$/", $name) === 1;
}

function verifyNicovideo($name) {
  return strlen($name) <= 11 && preg_match("/^(sm|nm)\d+$/", $name) === 1;
}

function createAlert($text) {
  echo "
  (function () {
    let div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.boxSizing = 'border-box';
    div.style.width = '480px';
    div.style.top = '40px';
    div.style.left = '50%';
    div.style.marginLeft = '-240px';
    div.style.zIndex = '128';
    div.style.padding = '20px 40px';
    div.style.backgroundColor = '#eee';
    div.style.color = 'black';
    div.style.border = '2px grey solid';
    div.style.borderRadius = '5px';
    div.innerHTML = '$text ';
    let a = document.createElement('a');
    a.style.float = 'right';
    a.style.cursor = 'pointer';
    a.style.textDecoration = 'underline';
    a.innerHTML = '(Close)';
    a.onclick = () => document.body.removeChild(div);
    div.insertBefore(a, div.firstChild);
    document.body.appendChild(div);
  })();
  ";
}

function isLocalhost() {
  if (!isset($_SERVER["HTTP_HOST"])) {
    return false;
  }
  return strpos($_SERVER["HTTP_HOST"], "localhost") !== false;
}

function addSong($type, $name) {
  global $mysqli;
  $name = $mysqli->escape_string($name);
  $client = Client::getOrAddUserQueue();

  $result = $mysqli->query("SELECT MAX(queue_index) AS queue_index FROM queued_song WHERE queue_id=$client->queueId");
  $last = 0;
  if ($row = $result->fetch_assoc()) {
    if (!empty($row['queue_index'])) {
      $last = $row['queue_index'];
    }
  }

  $song = Song::getSongByType($type, $name);

  $mysqli->query("INSERT INTO queued_song (queue_id, queue_index, song_id, type, name)
    VALUES ($client->queueId, " . ($last + 1) . ", " . $song->id . ", $type, '$name')");

  echo "if (typeof createGoTheater == 'function') { createGoTheater('$client->encodedQueueId'); }";
  $typeName = getTypeName($type);
  $domain = isLocalhost() ? "localhost" : "karaqueue.com";
  $url = "http://$domain/theater.php?queue_id=$client->encodedQueueId";
  $a = "<a style=\"text-decoration: underline; cursor: pointer\" href=\"$url\">";
  createAlert("Successfully added `$name` from $typeName to queue `$a$client->encodedQueueId</a>`.");
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
} else if (isset($_GET["type"]) && isset($_GET["name"])) {
  $type = (int) $_GET["type"];
  $name = $_GET["name"];
  if ($type == 0 && verifyNicovideo($name)) {
    addSong(0, $name);
    $success = true;
  } else if ($type == 2 && verifyYoutube($name)) {
    addSong(2, $name);
    $success = true;
  }
}

if (!$success) {
  echo "alert('Error, unable to add song.');";
}

?>
