<?php
if (!isset($_GET["q"]) || !isset($_GET["_offset"])) {
  exit();
}

$offset = (int) $_GET["_offset"];
if ($offset < 0 || $offset > 1600) {
  exit();
}

$napi = "http://api.search.nicovideo.jp/api/v2/video/contents/search?" .
        "targets=title,description,tags&_sort=-viewCounter&fields=contentId,title,thumbnailUrl&_limit=10&q=" .
        rawurlencode($_GET["q"]) . "&_offset=" . $offset;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $napi);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$response = curl_exec($ch);
curl_close($ch);

echo $response;

?>
