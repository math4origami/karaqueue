function searchYoutube(q, callback) {
  youtubeQuery("search", "maxResults=10&type=video&q="+q, (r) => callback(r));
}

function searchNicovideo(q, callback) {
  var napi = "searchNicovideo.php?q=";
  httpRequest(napi+q, (r) => callback(r));
}

function getYoutubeResults() {
  return document.getElementById("youtubeResults");
}

function getNicovideoResults() {
  return document.getElementById("nicovideoResults");
}

function pressedSearch(input, event) {
  if (!isEnter(event)) {
    return;
  }
  removeAllChildren(getYoutubeResults());
  removeAllChildren(getNicovideoResults());

  var q = encodeURIComponent(input.value);
  searchYoutube(q, (r) => buildYoutubeResults(r));
  searchNicovideo(q, (r) => buildNicovideoResults(r));
}

function buildYoutubeResults(r) {
  var response = JSON.parse(r);
  if (!response || idx(response, "kind") != "youtube#searchListResponse") {
    return;
  }

  var container = getYoutubeResults();
  for (var item of response.items) {
    var title = document.createElement("div");
    title.className = "resultTitle";
    title.innerHTML = item.snippet.title;

    var img = document.createElement("img");
    img.className = "resultImg";
    img.src=item.snippet.thumbnails.medium.url;

    var div = document.createElement("div");
    div.className = "resultRow";
    div.appendChild(img);
    div.appendChild(title);
    container.appendChild(div);
    console.log(item.id.videoId);
  }
}

function buildNicovideoResults(r) {
  var response = JSON.parse(r);
  if (!response || !response.meta || idx(response.meta, "status") != "200") {
    return;
  }

  var container = getNicovideoResults();
  for (var item of response.data) {
    var title = document.createElement("div");
    title.className = "resultTitle";
    title.innerHTML = item.title;

    var img = document.createElement("img");
    img.className = "resultImg";
    img.src=item.thumbnailUrl;

    var div = document.createElement("div");
    div.className = "resultRow";
    div.appendChild(title);
    div.appendChild(img);
    container.appendChild(div);
    console.log(item.contentId+" "+item.viewCounter);
  }
}
