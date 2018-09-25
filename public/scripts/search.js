function searchYoutube(q, callback) {
  youtubeQuery("search", "type=video&q="+encodeURIComponent(q), (r) => callback(r));
}

function pressedSearch(input, event) {
  if (!isEnter(event)) {
    return;
  }
  searchYoutube(input.value, (r) => {
    buildYoutubeResults(r);
  });
}

function getYoutubeResults() {
  return document.getElementById("youtubeResults");
}

function buildYoutubeResults(r) {
  var response = JSON.parse(r);
  if (!response || idx(response, "kind") != "youtube#searchListResponse") {
    return;
  }

  var container = getYoutubeResults();
  removeAllChildren(container);
  for (var item of response.items) {
    var title = document.createElement("div");
    title.className = "resultTitle";
    title.innerHTML = item.snippet.title;

    var img = document.createElement("img");
    img.className = "resultImg";
    img.src=item.snippet.thumbnails.medium.url;

    var div = document.createElement("div");
    div.appendChild(img);
    div.appendChild(title);
    container.appendChild(div);
    console.log(item.id.videoId);
  }
}