<?php
include_once "../private/client.php";

$client = Client::getUserQueue();
?>

<html>
<head>
<title>Karaqueue</title>
<link rel="stylesheet" type="text/css" href="styles/home.css">
<script type="text/javascript" src="scripts/utils.js"></script>
<script type="text/javascript" src="scripts/home.js"></script>
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

<div style="margin-top:30;">
  2018 Russell Chou <a href="http://www.twitter.com/math4origami/">@math4origami</a>
</div>

<script type="text/javascript">
createBookmarklet();
displayError();
</script>
</body>
</html>
