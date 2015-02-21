<?php
include_once "user.php";

if (isset($_GET["id"])) {
  $user = User::load($_GET["id"]);
} else {
  $user = User::load();
}

if (isset($_GET["action"])) {
  $user->queue_id = (int)$_GET["queue_id"];
  $user->update();
}
?>

<html>
<head>
<script type="text/javascript">
function isInvalidInput(event) {
  return !/\d/.test(String.fromCharCode(event.charCode));
}

function isEnter(event) {
  return event.keyIdentifier == "Enter";
}

function pressedId(input, event) {
  if (isEnter(event)) {
    var submit = document.getElementById("load");
    submit.click();
    return false;
  } else if (isInvalidInput(event)) {
    return false;
  }

  return true;
}

function pressedQueueId(input, event) {
  if (isEnter(event)) {
    var submit = document.getElementById("update");
    submit.click();
    return false;
  } else if (isInvalidInput(event)) {
    return false;
  }

  return true;
}

</script>
</head>

<body>

<div><h1>Edit User</h1></div>

<form action="editUser.php">
<div>Id: <input type="text" name="id" value="<?= $user->id ?>" onkeypress="return pressedId(this, event)"></div>
<div><input id="load" type="submit" value="Load"></div>

<div>Queue Id: <input type="text" name="queue_id" value="<?= $user->queue_id ?>" onkeypress="return pressedQueueId(this, event)"></div>
<div><input id="update" type="submit" name="action" value="Update"></div>
</form>

</body>
</html>