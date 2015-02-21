<?php 
include_once "user.php";
$user = User::load();
$queue_id = $user->queue_id;
?>
<html>
<head>
<script type="text/javascript">
var address = "//" + window.location.host + window.location.pathname;
address = address.replace("index.php", "");
var siteLabel = "Karaqueue";
if (window.location.host.indexOf("localhost") > -1) {
  siteLabel = "Localhost";
}
</script>
</head>

<body>
<div><h1>Karaqueue</h1></div>

<div id="theater" style="margin-bottom: 2;">Go to <a href="theater.php?queue_id=<?= $queue_id ?>">Theater</a></div>
<div id="extension" style="font-style: italic; margin-left: 10px;">
Requires Extension: <a href="https://chrome.google.com/webstore/detail/karaqueueextension/jbioiajcgjedimmhoflicdgjidjihobb">Karaqueue Extension</a>
</div>


<div id="bookmark" style="margin-top: 20;">Bookmarklet: </div>
<script type="text/javascript">
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
</script>

<div style="margin-top:30;">
  2014 Russell Chou <a href="http://www.twitter.com/math4origami/">@math4origami</a>
</div>
</body>
</html>
