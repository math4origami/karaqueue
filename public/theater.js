
var SceneObject = function() {
  var that = {};

  that.isEnded = function() {
    return false;
  }

  that.togglePause = function() {

  }

  that.getCurrentTime = function() {
    return 0;
  }

  that.getTotalTime = function() {
    return 0;
  }

  return that;
}

SceneObject.getCurrentSceneObject = function() {
  var sceneVideo = SceneVideo();
  if (sceneVideo) {
    return sceneVideo;
  }

  var sceneFrame = SceneFrame();
  if (sceneFrame) {
    return sceneFrame;
  }

  var youtubePlayer = YoutubePlayer();
  if (youtubePlayer) {
    return youtubePlayer;
  }

  return null;
}

var SceneVideo = function() {
  var that = SceneObject();
  var sceneVideo = document.getElementById("sceneVideo");
  if (!sceneVideo) {
    return null;
  }
  var TEMP_TIMEOUT = 6000;

  function loadTemp() {
    var clientSong = getClientSong();
    if (!clientSong.loadedTemp) {
      clientSong.loadedTemp = true;
      clientSong.loadedTempTime = now();

      clientSong.tempWindow = window.open("http://www.nicovideo.jp/watch/" + clientSong.name, "_blank",
        "width=100, height=100, top=0, left=600");
      if (clientSong.tempWindow) {
        clientSong.tempWindow.blur();
      }

      window.focus();
    } else if (now() >= clientSong.loadedTempTime + TEMP_TIMEOUT) {
      if (clientSong.tempWindow) {
        clientSong.tempWindow.close();
        clientSong.tempWindow = null;
      }
      sceneVideo.pause();

      var scene = document.createElement("iframe");
      scene.src = "scene.php?name=" + clientSong.name;
      scene.scrolling = false;
      scene.className = "sceneFrame";

      var stage = document.getElementById("stage");
      removeAllChildren(stage);
      stage.appendChild(scene);

      return false;
    }

    sceneVideo.load();
  }

  function cleanupTemp() {
    var clientSong = getClientSong();
    if (clientSong.tempWindow) {
      clientSong.tempWindow.close();
      clientSong.tempWindow = null;
    }
  }

  that.isLoaded = function() {
    if (sceneVideo.readyState != 4) {
      loadTemp();
      return false;
    } else {
      cleanupTemp();
      return true;
    }
  }

  that.isEnded = function() {
    if (!that.isLoaded()) {
      return false;
    }
    return sceneVideo.ended;
  }

  that.togglePause = function() {
    if (sceneVideo.paused) {
      sceneVideo.play();
    } else {
      sceneVideo.pause();
    }
  }

  that.getCurrentTime = function() {
    return sceneVideo.currentTime;
  }

  that.getTotalTime = function() {
    return sceneVideo.duration;
  }

  return that;
}

var SceneFrame = function() {
  var that = SceneObject();
  var sceneFrame = getFirstElementByClassName("sceneFrame");
  if (!sceneFrame) {
    return null;
  }
  var embed = getFirstElementByTagName("embed", sceneFrame.contentDocument);
  if (!embed) {
    return null;
  }
  that.embed = embed;

  function embedFunction(name, none, arg) {
    if (typeof embed[name] == "function") {
      return embed[name](arg);
    }
    if (none !== undefined) {
      return none;
    } else {
      return null;
    }
  }

  function getStatus() {
    return embedFunction("ext_getStatus");
  }

  that.hideComments = function() {
    embedFunction("ext_setCommentVisible", null, false);
  }

  that.isEnded = function() {
    that.hideComments();
    return getStatus() == "end";
  }

  that.togglePause = function() {
    var status = getStatus();
    if (status == "playing") {
      embed.ext_play(false);
    } else if (status == "paused") {
      embed.ext_play(true);
    }
  }

  that.getCurrentTime = function() {
    return embedFunction("ext_getPlayheadTime", 0);
  }

  that.getTotalTime = function() {
    return embedFunction("ext_getTotalTime", 0);
  }

  return that;
}

var YoutubePlayer = function() {
  var that = SceneObject();
  var youtubePlayer = document.getElementById("youtubePlayer");
  if (!youtubePlayer) {
    return null;
  }

  that.isEnded = function() {
    return youtubePlayer.getPlayerState() == 0;
  }

  that.togglePause = function() {
    var state = youtubePlayer.getPlayerState();
    if (state == 1) {
      youtubePlayer.pauseVideo();
    } else if (state == 2) {
      youtubePlayer.playVideo();
    }
  }

  that.getCurrentTime = function() {
    return youtubePlayer.getCurrentTime();
  }

  that.getTotalTime = function() {
    return youtubePlayer.getDuration();;
  }

  return that;
}

function refreshStage() {
  if (checkStage()) {
    incrementStage();
  }
}

function checkStage() {
  if (currentStage < 0) {
    return true;
  }

  var sceneObject = SceneObject.getCurrentSceneObject();
  if (sceneObject) {
    return sceneObject.isEnded();
  }

  return false;
}

function buildYoutubeScene(scene, clientSong) {
  var youtubeDiv = document.createElement("div");
  youtubeDiv.id = "youtubeDiv";

  var youtubeScript = document.createElement("script");
  youtubeScript.innerHTML = "\
    var params = { allowScriptAccess: 'always' }; \
    var atts = { id: 'youtubePlayer' }; \
    swfobject.embedSWF('http://www.youtube.com/v/" + clientSong.name +
      "?autoplay=1&enablejsapi=1&playerapiid=ytplayer&version=3', \
      'youtubeDiv', '425', '356', '8', null, null, params, atts); ";

  scene.appendChild(youtubeDiv);
  scene.appendChild(youtubeScript);
}

function onYouTubePlayerReady(playerId) {
  var player = document.getElementById("youtubePlayer");
  player.style.width = "100%";
  player.style.height = "100%";
}

function doUpdateStage() {
  var clientSong = getClientSong();
  if (!clientSong) {
    return;
  }

  var scene = document.createElement("div");
  if (clientSong.type == 1) {
    scene.className = "damkaraScene"; 
  } else if (clientSong.type == 2) {
    scene.className = "youtubeScene";
    buildYoutubeScene(scene, clientSong);
  } else {
    scene.className = "nicokaraScene";
  }
  scene.id = clientSong.name;

  var stage = document.getElementById("stage");
  removeAllChildren(stage);
  stage.appendChild(scene);

  clientSong.loadedTemp = false;
}

function handleSpace() {
    var sceneObject = SceneObject.getCurrentSceneObject();
    if (sceneObject) {
      sceneObject.togglePause();
    }
}

run(refreshStage, 3000);
