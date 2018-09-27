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
    var div = buildResultRow(item.snippet.title, item.snippet.thumbnails.medium.url, 
                             createAddSong(2, item.id.videoId));
    container.appendChild(div);
  }
}

function buildNicovideoResults(r) {
  var response = JSON.parse(r);
  if (!response || !response.meta || idx(response.meta, "status") != "200") {
    return;
  }

  var container = getNicovideoResults();
  for (var item of response.data) {
    var div = buildResultRow(item.title, item.thumbnailUrl, createAddSong(0, item.contentId));
    container.appendChild(div);
  }
}

function buildResultRow(titleString, imgUrl, callback) {
  var title = document.createElement("div");
  title.className = "resultTitle";
  title.innerHTML = titleString;

  var img = document.createElement("img");
  img.className = "resultImg";
  img.src = imgUrl;

  var titleHandler = document.createElement("div");
  var titleButton = document.createElement("div");
  var imgHandler = document.createElement("div");
  var imgButton = document.createElement("div");
  titleHandler.className = "resultTitle resultHandler";
  titleButton.className = "resultTitle resultButton";
  imgHandler.className = "resultImg resultHandler";
  imgButton.className = "resultImg resultButton";

  var doubleclick = createDoubleclick(callback);
  titleHandler.onclick = doubleclick;
  imgHandler.onclick = doubleclick;
  disableMobileZoom(titleHandler, doubleclick);
  disableMobileZoom(imgHandler, doubleclick);

  var div = document.createElement("div");
  div.className = "resultRow";
  div.appendChild(img);
  div.appendChild(title);
  div.appendChild(imgHandler);
  div.appendChild(titleHandler);
  div.appendChild(imgButton);
  div.appendChild(titleButton);
  return div;
}

function createAddSong(type, name) {
  var url = "addSong.php?type=" + type + "&name=" + name;
  return (event) => {
    var row = event.target.parentElement;
    row.classList.add("resultSelected");
    httpRequest(url, (r) => {
      row.classList.remove("resultSelected");
      var script = document.createElement('script');
      script.innerHTML = r;
      document.body.appendChild(script);
    });
  };
}

function createSearchOptions() {
  var texts = ["カラオケ", "ニコカラ", "歌詞付き", "off vocal"];
  var divs = [];
  var container = document.getElementById("searchOptions");
  var input = document.getElementById("searchInput");

  for (var text of texts) {
    var div = document.createElement("div");
    div.className = "searchButton";
    div.innerHTML = text;
    createSearchOption(text, div, input);
    container.appendChild(div);
    divs.push(div);
  }
  updateSearchOption(texts, divs, input);
}

function createSearchOption(text, div, input) {
  div.onclick = () => {
    if (!removeSearchOption(text, div, input)) {
      addSearchOption(text, div, input);
    }
  };
}

function removeSearchOption(text, div, input) {
  var index = input.value.indexOf(text);
  if (index < 0) {
    return false;
  }

  var remove = text;
  if (isSpace(input.value.charAt(index - 1))) {
    remove = input.value.charAt(index - 1) + text;
  } else if (isSpace(input.value.charAt(index + text.length))) {
    remove += input.value.charAt(index + text.length);
  }
  input.value = input.value.replace(remove, "");
  div.classList.remove("searchSelected");
  return true;
}

function isSpace(str) {
  return str.charCodeAt(0) == 32 || str.charCodeAt(0) == 12288;
}

function addSearchOption(text, div, input) {
  if (input.value.length > 0  && !isSpace(input.value.charAt(input.value.length - 1))) {
    input.value += " ";
  }
  input.value += text;
  div.classList.add("searchSelected");
}

function updateSearchOption(texts, divs, input) {
  input.oninput = () => {
    for (var i in texts) {
      var text = texts[i];
      if (input.value.indexOf(text) >= 0) {
        divs[i].classList.add("searchSelected");
      } else {
        divs[i].classList.remove("searchSelected");
      }
    }
  };
}