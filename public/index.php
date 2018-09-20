<?php
include_once "client.php";

$client = Client::getUserQueue();
?>

<html>
<head>
<title>Karaqueue</title>
<script type="text/javascript">
var address = "//" + window.location.host + window.location.pathname;
address = address.replace("index.php", "");
var joinValue = "";

function isEnter(event) {
  return event.key == "Enter";
}

function isValidInput(string) {
  return /^[\w-_]*$/.test(string) && string.length <= 6;
}

function pressedJoin(input, event) {
  if (!isEnter(event)) {
    return;
  }
  if (input.value.length != 6) {
    document.getElementById("joinTheaterError").innerHTML = "Queue ids must be 6 characters.";
    return;
  }
  window.location.href = address + "theater.php?join=1&queue_id=" + input.value;
}

function inputJoin(input, event) {
  if (!isValidInput(input.value)) {
    input.value = joinValue;
  }
  joinValue = input.value;
}
</script>
<script type="text/javascript" src="utils.js"></script>
</head>

<body>
<div><h1>Karaqueue</h1></div>

<?php if ($client->queueId) { ?>
<div id="goTheater" style="margin-bottom: 2;">
  <a href="theater.php?queue_id=<?= $client->encodedQueueId ?>">Go to your Queue</a>
</div>
<?php } ?>

<div id="newTheater" style="margin-bottom: 2;">
  <a href="theater.php?new_queue=1">Start a new Queue</a>
</div>

<div id="joinTheater" style="margin-bottom: 2;">
  Join a Queue 
  <input type="text" name="queue_id" onkeypress="pressedJoin(this, event)" oninput="inputJoin(this, event)"/>
  <span id="joinTheaterError" style="color: red;"></span>
</div>

<div id="extension" style="font-style: italic; margin-left: 10px;">
Requires Extension: <a href="https://chrome.google.com/webstore/detail/karaqueueextension/jbioiajcgjedimmhoflicdgjidjihobb">Karaqueue Extension</a>
</div>

<div id="bookmark" style="margin-top: 20;">Bookmarklet: </div>
<script type="text/javascript">
var siteLabel = "Karaqueue";
if (window.location.host.indexOf("localhost") > -1) {
  siteLabel = "Localhost";
}

var link = document.createElement("a");
link.innerHTML = siteLabel + " Add Song";
link.href = "javascript:(function() { \
  var addSongPath = window.location.protocol + '" + address + "addSong.php?'; \
  var damData = document.getElementsByClassName('nicokaraDamData'); \
  if (damData.length > 0) { \
    addSongPath += damData[0].id; \
  } else { \
    addSongPath += 'address=' + encodeURIComponent(window.location.href); \
  } \
  var script = document.createElement('script'); \
  script.src = addSongPath; \
  document.body.appendChild(script); \
})();";

  // var bookmark = document.createElement('iframe'); \
  // document.body.appendChild(bookmark); \
var bookmark = document.getElementById("bookmark");
bookmark.appendChild(link);


var join_queue_error = parseSearch("join_queue_error");
if (join_queue_error) {
  document.getElementById("joinTheaterError").innerHTML = "Queue with id " + join_queue_error + " does not exist.";
}
</script>

<div style="margin-top:30;">
  2018 Russell Chou <a href="http://www.twitter.com/math4origami/">@math4origami</a>
</div>
</body>
</html>
