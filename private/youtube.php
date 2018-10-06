<?php
include_once "constant.php";
$constant = Constant::load("youtubeApiKey");
$key = isset($constant) ? $constant->value : "";
?>

<script type="text/javascript">
function youtubeQuery(api, search, callback, errorCallback) {
  var key = "<?= $key ?>";
  var gapi = "https://www.googleapis.com/youtube/v3/" + api + "?part=snippet&key=" + key + "&" + search;
  httpRequest(gapi, callback, errorCallback);
}
</script>