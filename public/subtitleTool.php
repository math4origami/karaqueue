<html>

<head>
<link rel="stylesheet" type="text/css" href="basic.css">
<script type="text/javascript" src="utils.js"></script>
<script type="text/javascript" src="swfobject.js"></script>
<script type="text/javascript" src="queue.js"></script>
<script type="text/javascript" src="subtitleTool.js"></script>
</head>

<body onkeypress="return bodyKeyPress(event);">

<div id="theater">
<div id="sidebar">
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
  <textarea id="stageSubtitlesTextarea" disabled="true" onkeydown="return textareaKeyDown(event)"></textarea>
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
