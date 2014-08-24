
var clientQueue = [];
var currentStage = -1;
var highlightStage = -1;
var isLocal = false;

function setLocal() {
  var args = getArgs();
  if (args.local) {
    isLocal = true;
  }
}

function getActIndex() {
  if (highlightStage > -1) {
    return highlightStage;
  } else {
    return currentStage;
  }
}

function reloadQueue() {
  if (isLocal) {
    localGetQueue(reloadQueueCallback);
  } else {
    httpRequest("queue.php", reloadQueueServer); 
  }
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

function checkStage() {
  if (currentStage < 0) {
    return true;
  }

  var sceneVideo = document.getElementById("sceneVideo");
  if (!sceneVideo) {
    return false;
  }

  var clientSong = clientQueue[currentStage];
  console.log(sceneVideo.readyState);
  if (sceneVideo.readyState != 4) {
    if (!clientSong.loadedTemp) {
      clientSong.loadedTemp = true;
      clientSong.tempWindow = window.open("http://www.nicovideo.jp/watch/" + clientSong.name, "_blank",
        "width=100, height=100, top=0, left=600");
      console.log(clientQueue.tempWindow);
      if (clientSong.tempWindow) {
        clientSong.tempWindow.blur();
      }
      
      window.focus();
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

function incrementStage() {
  if (currentStage + 1 >= clientQueue.length) {
    return;
  }
  currentStage++;

  updateStage();
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
    if (isLocal) {
      localDeleteSong(clientQueue[actIndex].id, reloadQueue);
    } else {
      httpRequest("actSong.php?act=delete&id=" + clientQueue[actIndex].id, reloadQueue);
    }

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
    if (isLocal) {
      localRaiseSong(clientQueue[actIndex].id, reloadQueue);
    } else {
      httpRequest("actSong.php?act=raise&id=" + clientQueue[actIndex].id, reloadQueue);
    }

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
    if (isLocal) {
      localLowerSong(clientQueue[actIndex].id, reloadQueue);
    } else {
      httpRequest("actSong.php?act=lower&id=" + clientQueue[actIndex].id, reloadQueue);
    }

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
    if (sceneVideo) {
      if (sceneVideo.paused) {
        sceneVideo.play();
      } else {
        sceneVideo.pause();
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

setLocal();
run(reloadQueue, 1000);
run(refreshStage, 5000);
