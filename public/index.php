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
<div class="headerBar">
  <div class="centerColumn">
    <h1>Karaqueue</h1>
    <div id="joinTheaterError"></div>
  </div>
</div>

<div class="actionBar">
  <div class="centerColumn">
    <?php if ($client->queueId) { ?>
    <a href="theater.php?queue_id=<?= $client->encodedQueueId ?>"><div id="goTheater" class="actionButton">
      Go to your Queue
    </div></a><?php } ?><a href="theater.php?new_queue=1"><div id="newTheater" class="actionButton">
      Start a new Queue
    </div></a>

    <div id="joinTheater" class="actionButton actionButtonRight">
      Join a Queue 
      <input type="text" name="queue_id" onkeypress="pressedJoin(this, event)" oninput="inputJoin(this, event)"/>
    </div>
  </div>
</div>

<div class="contentBar">
  <div class="centerColumn">
    <div class="contentRow">
      <a href="https://chrome.google.com/webstore/detail/karaqueueextension/jbioiajcgjedimmhoflicdgjidjihobb">
      <div class="contentButton">
        Karaqueue Extension
      </div></a>
      <div class="description">
        Install from the Chrome Web Store to quickly load NicoNicoDouga videos.
      </div>
    </div>

    <div class="contentRow">
      <a id="bookmarkletLink"><div id="bookmarkletDiv" class="contentButton"></div></a>
      <div class="description">
        Drag this Bookmarklet to your Bookmarks bar. 
        Click it while on any Youtube or NicoNicoDouga video page to add the video to your current queue.
      </div>
    </div>

    <div class="footer">
      2018 Russell Chou
      <a href="https://www.twitter.com/math4origami/">@math4origami</a>
      <a href="https://github.com/math4origami/karaqueue">Github</a>
    </div>
  </div>
</div>

<script type="text/javascript">
createBookmarklet();
displayError();
</script>
</body>
</html>
