function autoload () {
  var nicokaraScenes = document.getElementsByClassName("nicokaraScene");
  if (nicokaraScenes.length > 0) {
    var nicokaraScene = nicokaraScenes[0];
    if (nicokaraScene.childNodes.length > 0) {
      return;
    }

    var xmlRequest = new XMLHttpRequest();
    xmlRequest.open("GET", "http://flapi.nicovideo.jp/api/getflv/" + nicokaraScene.id, false);
    xmlRequest.send();
    var tags = xmlRequest.responseText.split("&");
    for (var i=0; i<tags.length; i++) {
      var tag = tags[i].split("=");
      if (tag[0] == "url") {
        var video = document.createElement("video");
        video.src = decodeURIComponent(tag[1]);
        video.autoplay = true;
        video.controls = true;
        video.id = "sceneVideo";
        nicokaraScene.appendChild(video);

        break;
      }
    }
  }
}

function autoadd () {
  var nicokaraAddSong = document.getElementById("nicokaraAddSong");
  if (nicokaraAddSong) {
    chrome.runtime.sendMessage({ url: nicokaraAddSong.href });
    nicokaraAddSong.parentNode.removeChild(nicokaraAddSong);
  }
}

function autodam () {
  var damkaraScenes = document.getElementsByClassName("damkaraScene");
  if (damkaraScenes.length > 0) {
    var damkaraScene = damkaraScenes[0];
    if (damkaraScene.childNodes.length > 0) {
      return;
    }

    var xmlRequest = new XMLHttpRequest();
    xmlRequest.open("GET", "http://www.clubdam.com/dam/app/auth/getOneTimeToken.jsp", false);
    xmlRequest.send();

    var damData = JSON.parse(damkaraScene.id);
    var token = xmlRequest.responseText;
    var videoFrame = document.createElement("iframe");
    videoFrame.id = "sceneFrame";
    videoFrame.scrolling = "no";
    videoFrame.src = 'http://www.clubdam.com/app/service/leaf/karaokeAtDam.do?' +
      'contentsId=' + damData.contentsId + 
      '&karaokeContentsId=' + damData.karaokeContentsId +
      '&siteCode=' + damData.siteCode +
      '&token=' + token;
    damkaraScene.appendChild(videoFrame);
  }
}

function addArtistDamButtons () {
  if (window.location.pathname.indexOf("artistKaraokeAtDamLeaf.html") < 0) {
    return;
  }
  var artistTag = document.getElementsByClassName("name");
  var artist = "";
  if (artistTag.length > 0) {
    artist = encodeURI(artistTag[0].innerHTML.trim());
  }

  var pickups = document.getElementsByClassName("pickupContents");
  for (var pickup_i=0; pickup_i<pickups.length; pickup_i++) {
    var pickup = pickups[pickup_i];
    var songs = pickup.getElementsByTagName("li");
    for (var song_i=0; song_i<songs.length; song_i++) {
      var song = songs[song_i];
      var tags = song.getElementsByTagName("a");
      var title = tags[0];
      var data = tags[1];
      data = data.href;
      data = data.replace(/'/g, "");
      data = data.substring(data.indexOf("(")+1);
      data = data.substring(0, data.indexOf(")"));
      var contentsIds = data.split(",");
      var args = "?artist=" + artist +
        "&title=" + encodeURI(title.innerHTML.trim()) +
        "&contentsId=" + contentsIds[0] +
        "&karaokeContentsId=" + contentsIds[1] +
        "&siteCode=" + contentsIds[2];
      console.log(args);
    }
  }
};

function addSongDamButton () {
  if (window.location.pathname.indexOf("songKaraokeAtDamLeaf.html") < 0) {
    return;
  }

  var title = "";
  var titleTag = document.getElementsByClassName("name");
  if (titleTag.length > 0) {
    title = encodeURI(titleTag[0].innerHTML.trim());
  }

  var artist = "";
  var artistTag = document.getElementsByClassName("artist");
  if (artistTag.length > 0) {
    var artistLink = artistTag[0].getElementsByTagName("a");
    if (artistLink.length > 0) {
      artist = encodeURI(artistLink[0].innerHTML.trim());
    }
  }

  var contentsId = "";
  var karaokeContentsId = "";
  var siteCode = "";
  var contentsTag = document.getElementsByClassName("button");
  if (contentsTag.length > 0) {
    var contentsLink = contentsTag[0].getElementsByTagName("a");
    if (contentsLink.length > 0) {
      var contentsScript = contentsLink[0].href;
      contentsScript = contentsScript.replace(/'/g, "");
      contentsScript = contentsScript.substring(contentsScript.indexOf("(")+1);
      contentsScript = contentsScript.substring(0, contentsScript.indexOf(")"));
      var contentsData = contentsScript.split(",");
      if (contentsData.length > 2) {
        contentsId = contentsData[0];
        karaokeContentsId = contentsData[1];
        siteCode = contentsData[2];
      }
    }
  }

  var duration = "";
  var wrapper = document.getElementById("SongLeafResultWrapper");
  if (wrapper) {
    var rows = wrapper.getElementsByTagName("tr");
    if (rows.length > 1) {
      var durationTag = rows[1].getElementsByTagName("strong");
      if (durationTag.length > 0) {
        duration = durationTag[0].innerHTML.trim();
      }
    }
  }

  var args =
    "title=" + title +
    "&artist=" + artist +
    "&contentsId=" + contentsId +
    "&karaokeContentsId=" + karaokeContentsId +
    "&siteCode=" + siteCode +
    "&duration=" + duration;
  var argsTag = document.createElement("div");
  argsTag.className = "nicokaraDamData";
  argsTag.id = args;
  document.body.appendChild(argsTag);
}

function formatDamPlayer () {
  if (window.location.pathname.indexOf("karaokeAtDam.do") < 0) {
    return;
  }

  document.body.style.overflow = "hidden";

  var maximize = ["Wrapper", "Content", "MainBox", "directPlayer"];
  for (var i=0; i<maximize.length; i++) {
    var element = document.getElementById(maximize[i]);
    element.style.width = (window.innerWidth + 280) + "px";
    element.style.height = "100%";
  }

  var minimize = ["Header", "Footer", "StreamWindowConsole"];
  for (var i=0; i<minimize.length; i++) {
    var element = document.getElementById(minimize[i]);
    element.style.display = "none";
  }
}

setInterval(autoload, 1000);
setInterval(autoadd, 1000);
setInterval(autodam, 1000);
addSongDamButton();
formatDamPlayer();
