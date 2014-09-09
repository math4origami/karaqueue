<html>
<head>
<script type="text/javascript">
var address = window.location.origin + window.location.pathname;
address = address.replace("index.php", "");
</script>
</head>

<body>
<div><h1>Karaqueue</h1></div>

<div id="theater" style="margin-bottom:20;">Go to <a href="theater.php">Theater</a></div>

<div id="bookmark">Bookmarklet: </div>
<script type="text/javascript">
var link = document.createElement("a");
link.innerHTML = "Karaqueue Add Song";
link.href = "javascript:(function() { \
  var addSongPath = '" + address + "addSong.php?'; \
  var damData = document.getElementsByClassName('nicokaraDamData'); \
  if (damData.length > 0) { \
    addSongPath += damData[0].id; \
  } else { \
    addSongPath += 'address=' + encodeURIComponent(window.location.href); \
  } \
  var added = open(addSongPath); \
  var added = open(addSongPath); \
})();";

  // var bookmark = document.createElement('iframe'); \
  // document.body.appendChild(bookmark); \
var bookmark = document.getElementById("bookmark");
bookmark.appendChild(link);
</script>

<div>
Extension/script: <a href="extension.crx">Karaqueue Extension</a>
</div>

<div style="margin-top:20;">
  2014 Russell Chou <a href="http://www.twitter.com/math4origami/">@math4origami</a>
</div>
</body>
</html>
