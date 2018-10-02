<?php
if (isset($_GET['name'])) {
  $name = $_GET['name'];
} else {
  $name = '';
}
?>

<html>
<head>
<link rel="stylesheet" type="text/css" href="styles/basic.css">
</head>

<body>

<div id="sceneFrameCover"></div>

<div id="sceneFrameContainer">
<script type="text/javascript" src="http://ext.nicovideo.jp/thumb_watch/<?php echo $name;?>">
</script>
</div>

</body>
</html>
