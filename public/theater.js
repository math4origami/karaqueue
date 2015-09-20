
const TEMP_TIMEOUT = 6000;

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
    return 1;
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

      buildSceneFrame(clientSong);

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
    var clientSong = getClientSong();
    if (sceneVideo.readyState != 4 && !clientSong.hasLoaded) {
      loadTemp();
      return false;
    } else {
      cleanupTemp();
      clientSong.hasLoaded = true;
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
    return callObjFunction(embed, name, none, arg);
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
    return embedFunction("ext_getTotalTime", 1);
  }

  return that;
}

var YoutubePlayer = function() {
  var that = SceneObject();
  var youtubePlayer = document.getElementById("youtubePlayer");
  if (!youtubePlayer) {
    return null;
  }

  function playerFunction(name, none) {
    return callObjFunction(youtubePlayer, name, none);
  }

  function getPlayerState() {
    return playerFunction("getPlayerState", -1);
  }

  that.isEnded = function() {
    return getPlayerState() == 0;
  }

  that.togglePause = function() {
    var state = getPlayerState();
    if (state == 1) {
      playerFunction("pauseVideo");
    } else if (state == 2) {
      playerFunction("playVideo");
    }
  }

  that.getCurrentTime = function() {
    return playerFunction("getCurrentTime", 0);
  }

  that.getTotalTime = function() {
    return playerFunction("getDuration", 1);
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
  } else {
    checkSceneFrame();
  }

  return false;
}

function checkSceneFrame() {
  var clientSong = getClientSong();
  if (clientSong.nicokaraSceneTime &&
      clientSong.nicokaraSceneTime + TEMP_TIMEOUT < now()) {
    clientSong.nicokaraSceneTime = null;
    buildSceneFrame(clientSong);
  }
}

function buildSceneFrame(clientSong) {
  var scene = document.createElement("iframe");
  scene.src = "scene.php?name=" + clientSong.name;
  scene.scrolling = false;
  scene.className = "sceneFrame";

  var stage = getStage();
  removeAllChildren(stage);
  stage.appendChild(scene);
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
    clientSong.nicokaraSceneTime = now();
  }
  scene.id = clientSong.name;

  var stage = getStage();
  removeAllChildren(stage);
  stage.appendChild(scene);

  clientSong.loadedTemp = false;
  subtitlesOffset = 0;
}

function togglePause() {
  var sceneObject = SceneObject.getCurrentSceneObject();
  if (sceneObject) {
    sceneObject.togglePause();
  }
}

function getStage() {
  return document.getElementById("stage");
}

function getStageSubtitles() {
  return document.getElementById("stageSubtitles");
}

function getStageSubtitlesText() {
  return document.getElementById("stageSubtitlesText");
}

var subtitlesVisible = true;
var subtitlesContinuous = true;
var subtitlesOffset = 0;
var subtitlesSize = 0;
var textShadowSize = 0;
var subtitlesOpacity = 0;

function handleKey(key) {
  if (key == " ") {
    togglePause();
  } else if (key == "s") {
    toggleSubtitles();
  } else if (key == "c") {
    subtitlesContinuous = !subtitlesContinuous;
  } else if (key == "a") {
    scrollSubtitlesOffset(1);
  } else if (key == "z") {
    scrollSubtitlesOffset(-1);
  } else if (key == "x") {
    resetSubtitlesOffset();
  } else if (key == "+") {
    incrementSubtitlesSize(1);
  } else if (key == "-") {
    incrementSubtitlesSize(-1);
  } else if (key == "=") {
    resetSubtitlesSize();
  } else if (key == "[") {
    incrementTextShadowSize(-1);
  } else if (key == "]") {
    incrementTextShadowSize(1);
  } else if (key == "\\") {
    resetTextShadowSize();
  } else if (key == ",") {
    incrementSubtitlesOpacity(-.1);
  } else if (key == ".") {
    incrementSubtitlesOpacity(.1);
  } else if (key == "/") {
    resetSubtitlesOpacity();
  }
}

function scrollSubtitlesOffset(inc) {
  subtitlesOffset += inc;
}

function resetSubtitlesOffset() {
  subtitlesOffset = 0;
}

function incrementSubtitlesSize(inc) {
  subtitlesSize += inc;
}

function resetSubtitlesSize() {
  subtitlesSize = 0;
}

function incrementTextShadowSize(inc) {
  textShadowSize += inc;
}

function resetTextShadowSize() {
  textShadowSize = 0;
}

function incrementSubtitlesOpacity(inc) {
  subtitlesOpacity += inc;
  subtitlesOpacity = Math.min(subtitlesOpacity, 1);
  subtitlesOpacity = Math.max(subtitlesOpacity, 0);
  updateSubtitlesOpacity();
}

function resetSubtitlesOpacity(inc) {
  subtitlesOpacity = 0;
  updateSubtitlesOpacity();
}

function updateSubtitlesOpacity() {
  var stageSubtitles = getStageSubtitles();
  stageSubtitles.style.backgroundColor = "rgba(0,0,0,"+subtitlesOpacity+")";
}

function toggleSubtitles() {
  subtitlesVisible = !subtitlesVisible;

  var stageSubtitles = getStageSubtitles();
  if (subtitlesVisible) {
    stageSubtitles.style.visibility = "visible";
    refreshSubtitles();
  } else {
    stageSubtitles.style.visibility = "hidden";
  }
}

function refreshSubtitles() {
  if (!subtitlesVisible) {
    return;
  }

  var subtitlesText = getStageSubtitlesText();
  var clientSong = getClientSong();
  if (clientSong && subtitlesText &&
      cachedSubtitlesText != clientSong.subtitles) {
    subtitlesText.innerHTML = addLineSpans(constructRuby(clientSong));
    cachedSubtitlesText = clientSong.subtitles;
  }

  var videoHeight = calculateVideoHeight();
  formatSubtitles(videoHeight);
  scrollSubtitles(videoHeight);
}

function constructRuby(clientSong) {
  if (!clientSong.parsedFurigana) {
    return clientSong.subtitles;
  }
  
  var done = "";
  var subtitles = clientSong.subtitles;
  for (var i=0; i<clientSong.parsedFurigana.length; i++) {
    var tag = clientSong.parsedFurigana[i];
    var word = tag[0];
    var rt = tag[1];
    var position = subtitles.indexOf(word);
    if (position < 0 || rt.length < 1) {
      continue;
    }
    done += subtitles.slice(0, position);
    done += makeRubyTags(word, rt);
    subtitles = subtitles.slice(position + word.length); 
  }

  return done + subtitles;
}

function makeRubyTags(word, rt) {
  var done = "";

  for (var word_i=word.length-1; word_i>=0; word_i--) {
    var word_char = word.charAt(word_i);
    var rt_i = rt.lastIndexOf(word_char);
    if (rt_i < 0) {
      continue;
    }
    if (rt_i < rt.length-1 || word_i < word.length-1) {
      var word2 = word.slice(word_i+1);
      var rt2 = rt.slice(rt_i+1);
      done = makeRubyTag(word2, rt2) + done;
    }
    done = word_char + done;
    word = word.slice(0, word_i);
    rt = rt.slice(0, rt_i);
  }

  if (word.length > 0 || rt.length > 0) {
    done = makeRubyTag(word, rt) + done;
  }
  
  return done;
}

function makeRubyTag(word, rt) {
  return "<ruby>"+word+"<rt>"+rt+"</rt></ruby>";
}

function addLineSpans(text) {
  var lines = text.split("\n");
  return "<span>"+lines.join("</span>\n<span>")+"</span>";
}

const RATIO = 16/9;
var cachedVideoHeight = 1;
var cachedVideoLeft = 0;
var cachedSubtitlesSize = 0;
var cachedTextShadowSize = 0;
var cachedSubtitlesText = "";

function calculateVideoHeight() {
  var stage = getStage();
  if (!stage) {
    return 1;
  }
  var stageHeight = stage.offsetHeight;
  var stageHeightFromWidth = stage.offsetWidth / RATIO;
  return Math.min(stageHeight, stageHeightFromWidth);
}

function calculateVideoLeft(videoHeight) {
  var stage = getStage();
  if (!stage) {
    return 0;
  }
  var stageWidth = stage.offsetWidth;
  return (stageWidth - videoHeight * RATIO) / 2;
}

function calculateSubtitlesSize() {
  return 0.08 * Math.pow(1.1, subtitlesSize);
}

function formatSubtitles(videoHeight) {
  var videoLeft = calculateVideoLeft(videoHeight);
  var stageSubtitlesText = getStageSubtitlesText();
  if (stageSubtitlesText && 
      (videoHeight != cachedVideoHeight || 
       videoLeft != cachedVideoLeft ||
       subtitlesSize != cachedSubtitlesSize ||
       textShadowSize != cachedTextShadowSize)) {
    var padding = videoHeight * RATIO * 0.05;
    stageSubtitlesText.style.left = videoLeft;
    stageSubtitlesText.style.right =  videoLeft;
    stageSubtitlesText.style.paddingLeft = padding;
    stageSubtitlesText.style.paddingRight = padding; 
    stageSubtitlesText.style.fontSize = videoHeight * calculateSubtitlesSize();
    setTextShadow(videoHeight);
    cachedVideoHeight = videoHeight;
    cachedVideoLeft = videoLeft;
    cachedSubtitlesSize = subtitlesSize;
    cachedTextShadowSize = textShadowSize;
  }
}

function setTextShadow(videoHeight, color) {
  if (!color) {
    color = "#000";
  }

  var textShadowRatio = Math.pow(1.1, textShadowSize);
  var radius = Math.min(1 * textShadowRatio, 2);
  var offset = videoHeight * calculateSubtitlesSize() * 0.1 * textShadowRatio;
  var count = offset * Math.PI / radius;

  var textShadow = [];
  for (var i=0; i<count; i++) {
    var x = offset*Math.cos(i / count * 2 * Math.PI);
    var y = offset*Math.sin(i / count * 2 * Math.PI);
    textShadow = textShadow.concat(x+"px "+y+"px "+radius+"px "+color);
  }
  getStageSubtitlesText().style.textShadow = textShadow.join(",");
}

function scrollSubtitles(videoHeight) {
  var stageSubtitles = getStageSubtitles();
  var stageSubtitlesText = getStageSubtitlesText();
  var sceneObject = SceneObject.getCurrentSceneObject();
  var timeParam = 0;
  if (!stageSubtitles || !stageSubtitlesText) {
    return;
  }
  if (sceneObject && sceneObject.getTotalTime() > 0) {
    timeParam = sceneObject.getCurrentTime() / sceneObject.getTotalTime();
  }

  timeParam = Math.min(1, Math.max(0, timeParam * 1.4 - 0.3));
  var heightDiff = stageSubtitlesText.offsetHeight - stageSubtitles.offsetHeight;
  var videoHeightDiff = stageSubtitlesText.offsetHeight - videoHeight;
  var videoOffset = -(videoHeightDiff * timeParam);
  videoOffset += (stageSubtitles.offsetHeight - videoHeight) / 2;
  videoOffset = Math.min(0, Math.max(-heightDiff, videoOffset));

  var lineHeight = videoHeight * calculateSubtitlesSize() * 1.5 / 2;
  if (!subtitlesContinuous) {
    videoOffset = Math.round(videoOffset / lineHeight) * lineHeight;
  }

  videoOffset += subtitlesOffset * lineHeight;
  stageSubtitlesText.style.top = videoOffset;
}

run(refreshStage, 3000);
run(refreshSubtitles, 1000/60);
