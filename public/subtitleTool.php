<?php
include_once "../private/client.php";
include_once "../private/utils.php";

$client = Client::getSearchOrUserQueue();
if (!$client->queueId) {
  header('Location: /?join_queue_error=' . $client->encodedQueueId);
  exit();
}
?>
<html>

<head>
<title>Karaqueue Subtitles</title>
<link rel="icon" type="image/png" href="images/logo_32.png">
<link rel="stylesheet" type="text/css" href="styles/basic.css">
<?= $client->fixUrl() ?>
<script type="text/javascript" src="scripts/utils.js"></script>
<?php include_once "../private/youtube.php"; ?>
<script type="text/javascript" src="scripts/queue.js"></script>
<script type="text/javascript" src="scripts/subtitleTool.js"></script>
</head>

<body onkeypress="return bodyKeyPress(event);">

<div id="theater">
<div id="sidebar">
  <div id="menuTop">
    <span class="leftLink"><a href="/">Home</a></span>
    <span class="centerLink"><a href="theater.php?queue_id=<?= $client->encodedQueueId ?>">Theater</a></span>
  </div>
  <div id="menu">
    <input type="text" id="currentIdField" onkeypress="return updateCurrentField(this, event);">
    <input type="button" id="currentIdButton" value="Set" onclick="setCurrent()">
    <input type="button" id="deleteSongButton" value="X" onclick="deleteSong()">
    <input type="button" id="raiseSongButton" value="/\" onclick="raiseSong()">
    <input type="button" id="lowerSongButton" value="V" onclick="lowerSong()">
    <input type="button" id="displayHelpButton" value="?" onclick="displayHelp()">
  </div>
  <div id="queueContainer" onmouseleave="queueContainerLeave()">
    <div id="queue"></div>
  </div>
</div>
<div id="stageSubtitles" class="subtitleToolStageSubtitles">
  <div id="stageSubtitlesMenu">
    <input type="button" id="updateSong" value="Save Subtitles" onclick="updateSong()" disabled="true">
  </div>
  <textarea id="stageSubtitlesTextarea" disabled="true" onkeydown="return textareaKeyDown(event)">
    Double click a song to select it, then add subtitles for it in this text box. Furigana will be automatically added.
  </textarea>
</div>
</div>
<div id="help" onclick="displayHelp()">
<div><span class="helpKey">j</span> - previous song</div>
<div><span class="helpKey">k</span> - next song</div>
<div><span class="helpKey">o</span> - select song</div>
<div><span class="helpKey">d</span> - delete song</div>
<div><span class="helpKey">n</span> - lower song</div>
<div><span class="helpKey">p</span> - raise song</div>
<div><span class="helpKey">esc</span> - go back to songs</div>
<div><span class="helpKey">s</span> - save subtitles</div>
<div><span class="helpKey">?</span> - display help</div>
</div>

</body>
</html>
