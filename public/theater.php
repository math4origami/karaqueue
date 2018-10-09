<?php
include_once "../private/client.php";
include_once "../private/utils.php";

if (!empty($_GET["join"])) {
  $client = Client::setUserQueue();
} else if (!empty($_GET["new_queue"])) {
  $client = Client::addUserQueue();
} else {
  $client = Client::getSearchOrUserQueue();
}
if (!$client->queueId) {
  header('Location: /?join_queue_error=' . $client->encodedQueueId);
  exit();
}
?>
<html>

<head>
<title>Karaqueue Theater</title>
<link rel="icon" type="image/png" href="images/logo_32.png">
<link rel="stylesheet" type="text/css" href="styles/basic.css">
<?= $client->fixUrl() ?>
<script type="text/javascript" src="scripts/utils.js"></script>
<?php include_once "../private/youtube.php"; ?>
<script type="text/javascript" src="scripts/queue.js"></script>
<script type="text/javascript" src="scripts/theater.js"></script>
</head>

<body onkeypress="return bodyKeyPress(event);">

<div id="theater">
<div id="stage" class="stage"></div>
<div id="sidebarContainer" class="sidebarContainer" onmouseover="sidebarContainerOnMouseOver()" onmouseout="sidebarContainerOnMouseOut()">
  <div id="sidebar">
    <div id="menuTop">
      <span class="leftLink"><a href="/">Home</a></span>
      <span class="centerLink"><a href="subtitleTool.php?queue_id=<?= $client->encodedQueueId ?>">Subtitles</a></span>
      <span class="rightLink"><a href="theater.php?join=1&queue_id=<?= $client->encodedQueueId ?>">Join Link</a></span>
    </div>
    <div id="menu">
      <input type="text" id="currentIdField" onkeypress="return updateCurrentField(this, event);">
      <input type="button" id="currentIdButton" value="Set" onclick="setCurrent()">
      <input type="button" id="deleteSongButton" value="X" onclick="deleteSong()">
      <input type="button" id="raiseSongButton" value="/\" onclick="raiseSong()">
      <input type="button" id="lowerSongButton" value="V" onclick="lowerSong()">
      <input type="button" id="displayHelpButton" value="?" onclick="displayHelp()">
      <input type="button" id="toggleSubtitlesButton" value="S" onclick="toggleSubtitles()">
    </div>
    <div id="queueContainer" onmouseleave="queueContainerLeave()">
      <div id="queue"></div>
    </div>
  </div>
</div>
<div id="newSongToaster">
</div>
<div id="stageSubtitlesTheaterMenuContainer">
  <div id="stageSubtitlesTheaterMenu">
    <input type="button" id="scrollSubtitlesBackButton" value="<<" onclick="scrollSubtitlesOffset(1)">
    <input type="button" id="scrollSubtitlesResetButton" value="|" onclick="resetSubtitlesOffset()">
    <input type="button" id="scrollSubtitlesForwardButton" value=">>" onclick="scrollSubtitlesOffset(-1)">
    <div style="width: 50px; display:inline-block"></div>
    <input type="button" id="subtitlesSizeDecreaseButton" value="-" onclick="incrementSubtitlesSize(-1)">
    <input type="button" id="subtitlesSizeResetButton" value="=" onclick="resetSubtitlesSize()">
    <input type="button" id="subtitlesSizeIncreaseButton" value="+" onclick="incrementSubtitlesSize(1)">
  </div>
</div>
<div id="stageSubtitles" class="stageSubtitlesTheater">
  <div id="stageSubtitlesText"></div>
</div>
</div>
<div id="help" onclick="displayHelp()">
<div><span class="helpKey">j</span> - previous song</div>
<div><span class="helpKey">k</span> - next song</div>
<div><span class="helpKey">o</span> - select song</div>
<div><span class="helpKey">d</span> - delete song</div>
<div><span class="helpKey">n</span> - lower song</div>
<div><span class="helpKey">p</span> - raise song</div>
<div><span class="helpKey">space</span> - play/pause</div>
<div><span class="helpKey">s</span> - toggle subtitles</div>
<div><span class="helpKey">c</span> - toggle subtitles continuous</div>
<div><span class="helpKey">a</span> - scroll subtitles back</div>
<div><span class="helpKey">z</span> - scroll subtitles forward</div>
<div><span class="helpKey">x</span> - scroll subtitles reset</div>
<div><span class="helpKey">-</span> - decrease subtitles size</div>
<div><span class="helpKey">+</span> - increase subtitles size</div>
<div><span class="helpKey">=</span> - reset subtitles size</div>
<div><span class="helpKey">?</span> - display help</div>
</div>

</body>
</html>
