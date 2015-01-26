
var clientQueue = [];
var currentStage = -1;
var highlightStage = -1;

function getActIndex() {
  if (highlightStage > -1) {
    return highlightStage;
  } else {
    return currentStage;
  }
}

function reloadQueue() {
  httpRequest("queue.php", reloadQueueServer);
}

function reloadQueueServer(response) {
  var serverQueue = JSON.parse(response);
  reloadQueueCallback(serverQueue);
}

function reloadQueueCallback(serverQueue) {
  var changed = false;
  for (var server_i in serverQueue) {
    var serverSong = serverQueue[server_i];
    if (server_i == clientQueue.length) {
      addQueue(serverSong, server_i);
    } else if (server_i > clientQueue.length) {
      console.log("server queue jumped past client queue, discard");
      break;
    }

    var clientSong = clientQueue[server_i];
    if (clientSong.name != serverSong.name) {
      updateQueue(serverSong, server_i);
      changed = true;
    }
  }

  while (serverQueue.length < clientQueue.length) {
    popQueue();
  }

  if (changed) {
    updateButtons();
  }
}

function buildYoutubeSong(name, queueSong) {
  var key = "AIzaSyAM1ahn1DkYNhmRvPBVnEHV0efORA52Vq4";
  var gapi = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + name + "&key=" + key;
  httpRequest(gapi, function(response) {
    buildYoutubeSongCallback(response, queueSong);
  });
}

function buildYoutubeSongCallback(response, queueSong) {
  var youtube = JSON.parse(response);
  
  var youtubeTitle = document.createElement("div");
  youtubeTitle.className = "youtubeTitle";
  youtubeTitle.innerHTML = youtube.items[0].snippet.title;
  
  var youtubeThumbnail = document.createElement("img");
  youtubeThumbnail.className = "youtubeThumbnail";
  youtubeThumbnail.src = youtube.items[0].snippet.thumbnails.high.url;

  queueSong.appendChild(youtubeThumbnail);
  queueSong.appendChild(youtubeTitle);
}

function buildQueueSong(serverSong, server_i) {
  var queueSong = null;
  if (serverSong.type == 1) {
    var damData = JSON.parse(serverSong.name);

    var damArtist = document.createElement("div");
    damArtist.className = "damArtist";
    damArtist.innerHTML = damData.artist;

    var damTitle = document.createElement("div");
    damTitle.className = "damTitle";
    damTitle.innerHTML = damData.title;

    var damDuration = document.createElement("div");
    damDuration.className = "damDuration";
    damDuration.innerHTML = damData.duration;

    var damLogo = document.createElement("img");
    damLogo.className = "damLogo";
    damLogo.src = "clubdam.gif";

    queueSong = document.createElement("div");
    queueSong.className = "damQueue";
    queueSong.appendChild(damLogo);
    queueSong.appendChild(damArtist);
    queueSong.appendChild(damTitle);
    queueSong.appendChild(damDuration);
  } else if (serverSong.type == 2) {
    queueSong = document.createElement("div");
    queueSong.className = "youtubeQueue";
    buildYoutubeSong(serverSong.name, queueSong);
  } else {
    queueSong = document.createElement("iframe");
    queueSong.src = "http://ext.nicovideo.jp/thumb/" + serverSong.name;
    queueSong.scrolling = "no";
    queueSong.className = "queue";
  }
  queueSong.id = "queue_" + server_i;

  return queueSong;
}

function addQueue(serverSong, server_i) {
  var queueEntry = document.createElement("div");
  queueEntry.className = "queueEntry";
  queueEntry.id = "queueEntry_" + server_i;

  var queueButton = document.createElement("div");
  queueButton.className = "queueButton";
  queueButton.id = "queueButton_" + server_i;
  queueButton.onmouseover = function () {
    queueButtonMouseover(server_i);
  };
  queueButton.onclick = function () {
    queueButtonClick(server_i);
  };
  queueButton.ondblclick = function () {
    queueButtonDblClick(server_i);
  };

  var queueSong = buildQueueSong(serverSong, server_i);

  var queue = document.getElementById("queue");
  queueEntry.appendChild(queueButton);
  queueEntry.appendChild(queueSong);
  queue.appendChild(queueEntry);

  clientQueue.push(serverSong);

  highlightStage = clientQueue.length - 1;
  updateButtons();
}

function updateQueue(serverSong, server_i) {
  var clientEntry = document.getElementById("queue_" + server_i);
  var clientParent = clientEntry.parentNode;
  clientParent.removeChild(clientEntry);
  
  var newEntry = buildQueueSong(serverSong, server_i);
  clientParent.appendChild(newEntry);

  clientQueue[server_i] = serverSong;
}

function popQueue() {
  var clientSong = clientQueue.pop();
  var clientEntry = document.getElementById("queueEntry_" + clientQueue.length);
  clientEntry.parentNode.removeChild(clientEntry);
}

function refreshStage() {
  if (checkStage()) {
    incrementStage();
  }
}

function checkSceneVideo(sceneVideo) {
  var clientSong = clientQueue[currentStage];
  if (sceneVideo.readyState != 4) {
    if (!clientSong.loadedTemp) {
      clientSong.loadedTemp = true;
      clientSong.loadedTempTime = now();

      // var nicoTemp = document.getElementById("nicoTemp");
      // nicoTemp.src = "http://www.nicovideo.jp/watch/" + clientSong.name;
      
      clientSong.tempWindow = window.open("http://www.nicovideo.jp/watch/" + clientSong.name, "_blank",
        "width=100, height=100, top=0, left=600");
      if (clientSong.tempWindow) {
        clientSong.tempWindow.blur();
      }
      
      window.focus();
    } else if (now() >= clientSong.loadedTempTime + 6000) {
      if (clientSong.tempWindow) {
        clientSong.tempWindow.close();
        clientSong.tempWindow = null;
      }

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
    return false;
  } else if (clientSong.tempWindow) {
    clientSong.tempWindow.close();
    clientSong.tempWindow = null;
  }

  if (sceneVideo.ended) {
    return true;
  }

  return false;
}

function getSceneFrame() {
  var stageFrame = getFirstElementByClassName("sceneFrame");
  if (!stageFrame) {
    return null;
  }

  var embed = getFirstElementByTagName("embed", stageFrame.contentDocument);
  if (!embed) {
    return null;
  }

  return embed;
}

function checkSceneFrame(sceneFrame) {
  if (typeof sceneFrame.ext_setCommentVisible == "function") {
    sceneFrame.ext_setCommentVisible(false);
  }
  if (typeof sceneFrame.ext_getStatus == "function") {
    if (sceneFrame.ext_getStatus() == "end") {
      return true;
    }
  }

  return false;
}

function checkYoutubePlayer(youtubePlayer) {
  return youtubePlayer.getPlayerState() == 0;
}

function checkStage() {
  if (currentStage < 0) {
    return true;
  }

  var sceneVideo = document.getElementById("sceneVideo");
  if (sceneVideo) {
    return checkSceneVideo(sceneVideo);
  }

  var sceneFrame = getSceneFrame();
  if (sceneFrame) {
    return checkSceneFrame(sceneFrame);
  }

  var youtubePlayer = document.getElementById("youtubePlayer");  
  if (youtubePlayer) {
    return checkYoutubePlayer(youtubePlayer);
  }

  return false;
}

function incrementStage() {
  if (currentStage + 1 >= clientQueue.length) {
    return;
  }
  currentStage++;
  highlightStage = -1;
  updateStage();
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

function updateStage() {
  if (clientQueue.length <= 0 ||
      currentStage < 0  ||
      currentStage >= clientQueue.length) {
    return;
  } 

  var clientSong = clientQueue[currentStage];

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

  var currentIdField = document.getElementById("currentIdField");
  currentIdField.value = currentStage;

  clientSong.loadedTemp = false;
  updateButtons();
}

function updateButtons(dontScroll) {
  var scrollToId = -1;
  var scrollToCurrent = false;
  var buttons = document.getElementsByClassName("queueButton");
  for (var i=0; i<buttons.length; i++) {
    var queueButton = buttons[i];
    queueButton.className = queueButton.className.replace("queueButtonCurrent", "");
    queueButton.className = queueButton.className.replace("queueButtonHighlight", "");
  }

  if (currentStage > -1) {
    var queueButton = document.getElementById("queueButton_" + currentStage);
    queueButton.className += " queueButtonCurrent";
    scrollToId = currentStage;
    scrollToCurrent = true;
  }

  if (highlightStage > -1) {
    var queueButton = document.getElementById("queueButton_" + highlightStage);
    queueButton.className += " queueButtonHighlight";
    scrollToId = highlightStage;
    scrollToCurrent = false;

    var currentIdField = document.getElementById("currentIdField");
    currentIdField.value = highlightStage;
  }

  var deleteSongButton = document.getElementById("deleteSongButton");
  var raiseSongButton = document.getElementById("raiseSongButton");
  var lowerSongButton = document.getElementById("lowerSongButton");
  var actIndex = getActIndex();
  deleteSongButton.disabled = actIndex < 0 || actIndex >= clientQueue.length;
  raiseSongButton.disabled = actIndex < 1 || actIndex >= clientQueue.length;
  lowerSongButton.disabled = actIndex < 0 || actIndex >= clientQueue.length-1;
  
  console.log('highlight '+highlightStage);

  if (scrollToId > -1 && !dontScroll) {
    var scrollToEntry = document.getElementById("queueEntry_" + scrollToId);
    var queueContainer = document.getElementById("queueContainer");
    var queueHeight = queueContainer.offsetHeight;
    var scrolled = queueContainer.scrollTop;
    if (scrollToCurrent) {
      queueHeight = scrollToEntry.offsetHeight;
    }

    var top = scrollToEntry.offsetTop;
    var bottom = top + scrollToEntry.offsetHeight;
    if (top - scrolled < 0) {
      queueContainer.scrollTop = top;
    } else if (bottom - scrolled > queueHeight) {
      queueContainer.scrollTop = bottom - queueHeight;
    }
  }
}

function queueButtonMouseover(index) {
  var currentIdField = document.getElementById("currentIdField");
  currentIdField.value = index;
}

function queueButtonClick(index) {
  highlightStage = index;
  updateButtons();
}

function queueButtonDblClick(index) {
  highlightStage = index;
  setCurrent();
}

function queueContainerLeave() {
  var currentIdField = document.getElementById("currentIdField");
  if (highlightStage > -1) {
    currentIdField.value = highlightStage;
  } else if (currentStage > -1) {
    currentIdField.value = currentStage;
  }
}

function updateCurrentField(field, event) {
  if (event.keyIdentifier == "Enter") {
    setCurrent();
    return true;
  }
  if (!/\d/.test(String.fromCharCode(event.charCode))) {
    return false;
  }
  
  var newId = parseInt(field.value + String.fromCharCode(event.charCode));
  if (newId < 0 || clientQueue.length <= 0) {
    field.value = 0;
  } else if (newId >= clientQueue.length) {
    field.value = clientQueue.length - 1;
  } else {
    field.value = newId;
  }

  highlightStage = field.value;
  updateButtons();

  return false;
}

function setCurrent() {
  var newId = getActIndex();
  if (newId < 0 || clientQueue.length <= 0) {
    newId = 0;
  } else if (newId >= clientQueue.length) {
    newId = clientQueue.length - 1;
  }

  if (newId != currentIdField.value) {
    currentIdField.value = newId;
  }

  highlightStage = -1;
  if (clientQueue.length <= 0) {
    currentStage = -1;
  } else {
    currentStage = parseInt(newId);
    updateStage();
  }
}

function deleteSong() {
  var actIndex = getActIndex();
  if (actIndex >= 0 && actIndex < clientQueue.length) {
    httpRequest("actSong.php?act=delete&id=" + clientQueue[actIndex].id, reloadQueue);

    if (currentStage == actIndex) {
      if (currentStage >= clientQueue.length-1) {
        currentStage = clientQueue.length-2;
        updateStage();
      } else {
        currentStage++;
        updateStage();
        currentStage--;
        updateButtons();
      }
    } else if (currentStage > actIndex) {
      currentStage--;
      updateButtons();
    }

    if (highlightStage >= clientQueue.length-1) {
      highlightStage = clientQueue.length-2;
      updateButtons();
    }
  }
}

function raiseSong() {
  var actIndex = getActIndex();
  if (actIndex > 0 && actIndex < clientQueue.length) {
    httpRequest("actSong.php?act=raise&id=" + clientQueue[actIndex].id, reloadQueue);
    
    if (actIndex == highlightStage) {
      highlightStage--;
    }
    if (actIndex == currentStage) {
      currentStage--;
    } else if (actIndex-1 == currentStage) {
      currentStage++;
    }
  }
}

function lowerSong() {
  var actIndex = getActIndex();
  if (actIndex >= 0 && actIndex < clientQueue.length-1) {
    httpRequest("actSong.php?act=lower&id=" + clientQueue[actIndex].id, reloadQueue);
    
    if (actIndex == highlightStage) {
      highlightStage++;
    }
    if (actIndex == currentStage) {
      currentStage++;
    } else if (actIndex+1 == currentStage) {
      currentStage--;
    }
  }
}

function bodyKeyPress(event) {
  var key = String.fromCharCode(event.charCode);

  if (key == "j") {
    if (highlightStage < 0 && currentStage > -1) {
      if (currentStage < clientQueue.length-1) {
        highlightStage = currentStage+1;
      } else {
        highlightStage = currentStage;
      }
    } else if (highlightStage < clientQueue.length-1) {
      highlightStage++;
    }
    updateButtons();
  } else if (key == "k") {
    if (highlightStage < 0 && currentStage > -1) {
      if (currentStage > 0) {
        highlightStage = currentStage-1;
      } else {
        highlightStage = currentStage;
      }
    } else if (highlightStage > 0) {
      highlightStage--;
    }
    updateButtons();
  } else if (key == "d") {
    deleteSong();
  } else if (key == "o") {
    setCurrent();
  } else if (key == "n") {
    lowerSong();
  } else if (key == "p") {
    raiseSong();
  } else if (key == " ") {
    var sceneVideo = document.getElementById("sceneVideo");
    var sceneFrame = getSceneFrame();
    var youtubePlayer = document.getElementById("youtubePlayer");
    if (sceneVideo) {
      if (sceneVideo.paused) {
        sceneVideo.play();
      } else {
        sceneVideo.pause();
      }
    } else if (sceneFrame && typeof sceneFrame.ext_play == "function") {
      var status = sceneFrame.ext_getStatus();
      if (status == "playing") {
        sceneFrame.ext_play(false);
      } else if (status == "paused") {
        sceneFrame.ext_play(true);
      }
    } else if (youtubePlayer) {
      var state = youtubePlayer.getPlayerState();
      if (state == 1) {
        youtubePlayer.pauseVideo();
      } else if (state == 2) {
        youtubePlayer.playVideo();
      }
    }
  } else if (key == "?") {
    displayHelp();
  }
  return false;
}

function displayHelp() {
  var help = document.getElementById("help").style.visibility;
  if (help == "hidden") {
    help = "visible";
  } else {
    help = "hidden";
  }
  document.getElementById("help").style.visibility = help;
}

run(reloadQueue, 1000);
run(refreshStage, 3000);
