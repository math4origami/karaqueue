<html>
<head>
<link rel="stylesheet" type="text/css" href="basic.css">
<script type="text/javascript" src="utils.js"></script>
</head>

<body>
<script type="text/javascript">
var args = getArgs();
if (args.name) {
  var scene = document.createElement("div");
  scene.className = "nicokaraScene";
  scene.id = args.name;

  document.body.appendChild(scene);
}
</script>
</body>
</html>
