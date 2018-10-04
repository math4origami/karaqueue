<?php
include_once "../private/client.php";
include_once "../private/strings.php";

$client = Client::getUserQueue();

header('Content-type: text/html; charset=utf-8');

function printNewTheater($class) {
  echo
    "<a id='newTheater' href='theater.php?new_queue=1'><div class='actionButton $class'>
      Start a new Queue
    </div></a>";
}
?>

<html>
<head>
<title>Karaqueue</title>
<link rel="icon" type="image/png" href="images/favicon.png">
<link rel="stylesheet" type="text/css" href="styles/home.css">
<script type="text/javascript" src="scripts/utils.js"></script>
<script type="text/javascript" src="scripts/home.js"></script>
</head>

<body>
<div class="headerBar">
  <div class="centerColumn">
    <h1>Karaqueue</h1>
    <div class="linkIcons">
      <a class="linkIcon" href="https://github.com/math4origami/karaqueue">
        <img title="github.com/math4origami/karaqueue" src="images/GitHub-Mark-32px.png">
      </a>
      <a class="linkIcon" href="https://twitter.com/math4origami">
        <img title="@math4origami" src="images/Twitter_Logo_Blue.png">
      </a>
    </div>
  </div>
</div>

<div class="actionBar">
  <div class="centerColumn" id="actionButtons">
    <?php if ($client->queueId) { ?><a id="goTheater" href="theater.php?queue_id=<?= $client->encodedQueueId ?>"><div class="actionButton">
      Go to your Queue
    </div></a><?php } else {
      printNewTheater("");
    } ?>
    <div id="actionBarRight" class="actionBarRight">
      <?php if ($client->queueId) {
        printNewTheater("actionButtonRight");
      } ?><div id="joinTheater" class="actionButton actionButtonRight">
        Join a Queue
        <input type="text" name="queue_id" onkeypress="pressedJoin(this, event)" oninput="inputJoin(this, event)"/>
      </div>
    </div>
  </div>
</div>

<div class="contentBar">
  <div class="centerColumn">
    <div id="joinTheaterError" onclick="hideError()"></div>
    <a href="/" id="bookmarkletLink" title="<?= Strings::BOOKMARKLET_DESCRIPTION ?>">
      <div class="bookmarklet">
        <img id="bookmarkletImg" src="images/baseline_bookmark_black_36dp.png">
        <p id="bookmarkletText"></p>
      </div>
    </a>
    <?php include_once "search.php"; ?>
  </div>
</div>

<script type="text/javascript">
checkError();
createBookmarklet();
</script>
</body>
</html>
