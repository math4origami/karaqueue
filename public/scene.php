<?php
if (isset($_GET['name'])) {
  $name = $_GET['name'];
} else {
  $name = '';
}
?>

<html>
<head>
<link rel="stylesheet" type="text/css" href="basic.css">
</head>

<body>

<div id="sceneFrameCover"></div>

<div id="sceneFrameContainer">
<script type="text/javascript" src="http://ext.nicovideo.jp/thumb_watch/<?= $name ?>">
</script>
</div>

</body>
</html>
