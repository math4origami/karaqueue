var lastYoutube = {
  q: null,
  nextPageToken: null,
  searching: false,
};
var lastNicovideo = {
  q: null,
  offset: 0,
  searching: false,
  totalCount: 0
};

function searchYoutube(q) {
  if (lastYoutube.searching) {
    return;
  }

  var search = "maxResults=10&type=video";
  if (q != null) {
    lastYoutube.q = q;
    lastYoutube.nextPageToken = null;
  } else if (lastYoutube.nextPageToken != null) {
    search += "&pageToken=" + lastYoutube.nextPageToken;
  } else {
    return;
  }
  if (lastYoutube.q == null) {
    return;
  }

  search += "&q=" + lastYoutube.q;
  lastYoutube.searching = true;
  youtubeQuery("search", search, (r) => {
    lastYoutube.searching = false;
    var response = JSON.parse(r);
    if (!response || idx(response, "kind") != "youtube#searchListResponse") {
      return;
    }
    buildYoutubeResults(response);
    lastYoutube.nextPageToken = idx(response, "nextPageToken", null);
  }, youtubeError);
}

function youtubeError() {
  lastYoutube.searching = false;
}

function searchNicovideo(q) {
  if (lastNicovideo.searching) {
    return;
  }

  if (q != null) {
    lastNicovideo.q = q;
    lastNicovideo.offset = 0;
    lastNicovideo.totalCount = 0;
  } else if (lastNicovideo.offset >= lastNicovideo.totalCount) {
    return;
  }
  if (lastNicovideo.q == null) {
    return;
  }

  var napi = "searchNicovideo.php?q=" + lastNicovideo.q + "&_offset=" + lastNicovideo.offset;
  lastNicovideo.searching = true;
  httpRequest(napi, (r) => {
    lastNicovideo.searching = false;
    var response = JSON.parse(r);
    if (!response || !response.meta || idx(response.meta, "status") != "200") {
      return;
    }
    buildNicovideoResults(response);
    lastNicovideo.offset += 10;
    lastNicovideo.totalCount = idx(response.meta, "totalCount", 0);
  }, nicovideoError);
}

function nicovideoError() {
  lastNicovideo.searching = false;
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
  doSearch(input);
}

function clickSearch() {
  var input = document.getElementById("searchInput");
  doSearch(input);
}

function doSearch(input) {
  if (input.value.length <= 0) {
    displayError("Search query cannot be empty.");
    return;
  }
  hideError("Search query cannot be empty.");
  removeAllChildren(getYoutubeResults());
  removeAllChildren(getNicovideoResults());

  var q = encodeURIComponent(input.value);
  searchYoutube(q);
  searchNicovideo(q);
}

function shouldAutoscroll() {
  return document.body.scrollTop + document.body.offsetHeight >= document.body.scrollHeight - 10;
}

function createAutoscroll() {
  document.body.onscroll = () => {
    if (shouldAutoscroll()) {
      searchYoutube(null);
      searchNicovideo(null);
    }
  };
}

function buildYoutubeResults(response) {
  var container = getYoutubeResults();
  for (var item of response.items) {
    var div = buildResultRow(item.snippet.title, item.snippet.thumbnails.medium.url, 
                             createAddSong(2, item.id.videoId));
    container.appendChild(div);
  }
}

function buildNicovideoResults(response) {
  var container = getNicovideoResults();
  for (var item of response.data) {
    var url = item.thumbnailUrl.replace("http:", "https:");
    var div = buildResultRow(item.title, url, createAddSong(0, item.contentId));
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

  titleHandler.onclick = callback;
  imgHandler.onclick = callback;
  imgHandler.tabIndex = 0;

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
  input.value += text + " ";
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

function createBookmarklet() {
  var siteLabel = " Add Video";
  if (window.location.host.indexOf("localhost") > -1) {
    siteLabel = "Localhost" + siteLabel;
  } else {
    siteLabel = "Karaqueue" + siteLabel;
  }
  var img = document.getElementById("bookmarkletImg");
  var text = document.getElementById("bookmarkletText");
  img.alt = siteLabel;
  text.innerHTML = siteLabel;

  var link = document.getElementById("bookmarkletLink");
  link.href = "javascript:(function() { \
    var addSongPath = window.location.protocol + '//" + window.location.host + "/addSong.php?'; \
    var damData = document.getElementsByClassName('nicokaraDamData'); \
    if (damData.length > 0) { \
      addSongPath += damData[0].id; \
    } else { \
      addSongPath += 'address=' + encodeURIComponent(window.location.href); \
    } \
    var script = document.createElement('script'); \
    script.src = addSongPath; \
    document.body.appendChild(script); \
  })();";
}
