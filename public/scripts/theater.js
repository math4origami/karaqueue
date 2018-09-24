
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

  that.isLoaded = function() {
    return sceneVideo.readyState == 4;
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
  function instance() {
    return SceneFrame.instance;
  }
  function sendMessage(message) {
    message.sourceConnectorType = 1;
    instance().iframe.contentWindow.postMessage(message, SceneFrame.origin);
  }

  var that = SceneObject();
  var sceneFrame = getFirstElementByClassName("sceneFrame");
  if (!sceneFrame) {
    return null;
  }

  that.isEnded = function() {
    return instance().status == 4;
  }

  that.togglePause = function() {
    var status = instance().status;
    if (status == 2) {
      sendMessage({eventName: "pause"});
    } else {
      sendMessage({eventName: "play"});
    }
  }

  function smooth(time) {
    var data = instance();
    if (time < data.lastCurrentTime && (data.lastCurrentTime - time) < 1000) {
      return data.lastCurrentTime;
    } else {
      data.lastCurrentTime = time;
      return time;
    }
  }

  that.getCurrentTime = function(data) {
    var data = instance();
    switch (data.status) {
      case 1:
        return 0;
      case 2:
        var time = data.currentTime;
        if (data.playTime > data.updateTime) {
          time += performance.now() - data.playTime;
          if (data.pauseTime > data.updateTime) {
            time += data.pauseTime - data.updateTime;
          }
        } else {
          time += performance.now() - data.updateTime;
        }
        return smooth(time);
      case 3:
        if (data.pauseTime > data.updateTime) {
          return data.currentTime + data.pauseTime - data.updateTime;
        } else {
          return data.currentTime;
        }
      case 4:
        return that.getTotalTime();
    }
    return data.currentTime;
  }

  that.getTotalTime = function() {
    return instance().totalTime;
  }

  return that;
}

SceneFrame.origin = "http://embed.nicovideo.jp";
SceneFrame.init = function(iframe) {
  SceneFrame.instance = {
    iframe: iframe,
    status: 0,
    currentTime: 0,
    totalTime: 1,
    updateTime: 0,
    playTime: 0,
    pauseTime: 0,
    lastCurrentTime: 0
  };
}

window.addEventListener("message", (event) => {
  if (event.origin != SceneFrame.origin) {
    return;
  }
  var instance = SceneFrame.instance;
  switch (event.data.eventName) {
    case "playerStatusChange":
      instance.status = event.data.data.playerStatus;
      if (instance.status == 2) {
        instance.playTime = performance.now();
      } else if (instance.status == 3) {
        instance.pauseTime = performance.now();
      }
      break;
    case "playerMetadataChange":
      instance.currentTime = idx(event.data.data, "currentTime", 0);
      instance.totalTime = idx(event.data.data, "duration", 0);
      instance.updateTime = performance.now();
      break;
    case "loadComplete":
      SceneFrame().togglePause();
      break;
    default:
      console.log(event);
  }
});

var YoutubePlayer = function() {
  var that = SceneObject();
  var youtubePlayer = YoutubePlayer.player;
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

YoutubePlayer.reset = function() {
  YoutubePlayer.player = null;
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
  if (!sceneObject) {
    return true;
  }

  return sceneObject.isEnded();
}

function buildSceneFrame(clientSong) {
  var scene = document.createElement("iframe");
  SceneFrame.init(scene);
  scene.src = SceneFrame.origin + "/watch/" + clientSong.name + "?jsapi=1";
  scene.scrolling = false;
  scene.className = "sceneFrame";

  var stage = getStage();
  removeAllChildren(stage);
  stage.appendChild(scene);
}

function buildYoutubeScene(scene, clientSong) {
  var youtubeDiv = document.createElement("div");
  youtubeDiv.id = "youtubeDiv";
  scene.appendChild(youtubeDiv);

  var loadScript = "\
    YoutubePlayer.player = new YT.Player('youtubeDiv', { \
      videoId: '" + clientSong.name + "', \
      height: '100%', \
      width: '100%', \
      events: { \
        'onReady': onYouTubePlayerReady \
      } \
    }); \
  ";

  var youtubeScript = document.createElement("script");

  if (typeof YT == "undefined") {
    var youtubeApi = document.createElement("script");
    youtubeApi.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(youtubeApi, firstScriptTag);

    youtubeScript.innerHTML = "function onYouTubeIframeAPIReady() { " + loadScript + " }";
  } else {
    youtubeScript.innerHTML = loadScript;
  }

  scene.appendChild(youtubeScript);
}

function onYouTubePlayerReady(event) {
  event.target.playVideo();
}

function doUpdateStage() {
  var clientSong = getClientSong();
  if (!clientSong) {
    return;
  }

  YoutubePlayer.reset();
  var stage = getStage();
  removeAllChildren(stage);

  var scene = document.createElement("div");
  if (clientSong.type == 1) {
    scene.className = "damkaraScene";
  } else if (clientSong.type == 2) {
    scene.className = "youtubeScene";
    buildYoutubeScene(scene, clientSong);
  } else {
    buildSceneFrame(clientSong);
  }
  scene.id = clientSong.name;
  stage.appendChild(scene);

  subtitlesOffset = 0;
  textShadowSize = 0;
  subtitlesOpacity = 0;
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
    return false;
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

  return true;
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
  try {
    clientSong.parsedFurigana = JSON.parse(clientSong.furigana);
  } catch (err) {
    //do nothing
    clientSong.parsedFurigana = null;
  }

  if (!clientSong.parsedFurigana) {
    return clientSong.subtitles;
  }

  var done = "";
  var subtitles = clientSong.subtitles;
  for (var i=0; i<clientSong.parsedFurigana.length; i++) {
    var tag = clientSong.parsedFurigana[i];
    var word = tag[0];
    if (word.length <= 0) {
      continue;
    }
    var rt = tag[1];
    var position = subtitles.indexOf(word);
    if (position < 0) {
      continue;
    }
    done += subtitles.slice(0, position);
    if (rt.length == 0) {
      done += word;
    } else {
      done += makeRubyTags(word, rt);
    }
    subtitles = subtitles.slice(position + word.length);
  }

  return done + subtitles;
}

function makeRubyTags(word, rt) {
  var frontAndBack = [[], []];
  makePairs(word, rt, frontAndBack[0], frontAndBack[1]);
  var done = "";
  for (var pairs of frontAndBack) {
    for (var pair of pairs) {
      if (typeof pair == "string") {
        done += pair;
      } else {
        done += makeRubyTag(pair[0], pair[1]);
      }
    }
  }
  return done;
}

function makeRubyTag(word, rt) {
  return "<ruby>"+word+"<rt>"+rt+"</rt></ruby>";
}

function makePairs(word, rt, done, endDone) {
  if (word.length == 0 && rt.length == 0) {
    return true;
  }
  if (word.length == 0 || rt.length == 0) {
    done.push([word, rt]);
    return false;
  }

  if (word[0] == rt[0]) {
    done.push(word[0]);
    return makePairs(word.slice(1), rt.slice(1), done, endDone);
  }
  if (last(word) == last(rt)) {
    endDone.unshift(last(word));
    return makePairs(word.slice(0, word.length-1), rt.slice(0, rt.length-1), done, endDone);
  }

  var hiragana = findAllHiragana(word, rt);
  if (hiragana.length == 0) {
    done.push([word, rt]);
    return true;
  }

  for (var word_i of hiragana) {
    if (word_i == 0 && word_i == word.length-1) {
      continue;
    }
    var word_char = word.charAt(word_i);
    var possible = findPossibleMatches(word_char, rt);
    for (var rt_i of possible) {
      if (rt_i == 0 || rt_i.length-1) {
        continue;
      }
      var newDone = [];
      var newEndDone = [];
      if (makePairs(word.slice(word_i), rt.slice(rt_i), newDone, newEndDone)) {
        done.push([word.slice(0, word_i), rt.slice(0, rt_i)]);
        pushAll(done, newDone);
        unshiftAll(endDone, newEndDone);
        return true;
      }
    }
  }
  done.push([word, rt]);
  return false;
}

function findAllHiragana(word, rt) {
  var hiragana = [];
  for (var word_i=0; word_i<word.length; word_i++) {
    var word_char = word.charAt(word_i);
    if (rt.indexOf(word_char) >= 0) {
      hiragana.push(word_i);
    }
  }
  return hiragana;
}

function findPossibleMatches(word_char, rt) {
  var possible = [];
  var rt_from = 0;
  while (rt_from < rt.length) {
    var rt_i = rt.indexOf(word_char, rt_from);
    if (rt_i < 0) {
      break;
    }
    possible.push(rt_i);
    rt_from = rt_i + 1;
  }
  return possible;
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
var sidebarWidth = 333;

function calculateVideoHeight() {
  var stage = getStage();
  var stageSubtitles = getStageSubtitles();
  if (!stage || !stageSubtitles) {
    return 1;
  }
  var stageHeight = stage.offsetHeight;
  var stageHeightFromWidth = Math.max(1, stageSubtitles.offsetWidth - sidebarWidth) / RATIO;
  return Math.min(stageHeight, stageHeightFromWidth);
}

function calculateVideoLeft(videoHeight) {
  var stageSubtitles = getStageSubtitles();
  if (!stageSubtitles) {
    return 0;
  }
  var stageWidth = stageSubtitles.offsetWidth;
  return (stageWidth - videoHeight * RATIO) / 2;
}

function calculateVideoLeftDeltaWithSidebar(videoLeft) {
  return Math.max(0, sidebarWidth - videoLeft);
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
    var videoLeftDelta = calculateVideoLeftDeltaWithSidebar(videoLeft);
    stageSubtitlesText.style.left = videoLeft + videoLeftDelta;
    stageSubtitlesText.style.right = videoLeft - videoLeftDelta;
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

  timeParam = Math.min(1, Math.max(0, timeParam * 1.4 - 0.2));
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
