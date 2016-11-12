var queue_id = parseSearch('queue_id');
var clientQueue = [];
var currentStage = -1;
var highlightStage = -1;
var sidebarContainerHasMouse = false;
var sidebarContainerLastInputTime = 0;

function getClientSong() {
  if (clientQueue.length <= 0 ||
      currentStage < 0  ||
      currentStage >= clientQueue.length) {
    return null;
  }
  return clientQueue[currentStage];
}

function getActIndex() {
  if (highlightStage > -1) {
    return highlightStage;
  } else {
    return currentStage;
  }
}

function reloadQueue() {
  httpRequest("queue.php?queue_id="+queue_id, reloadQueueServer);
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
      changed = true;
    } else if (server_i > clientQueue.length) {
      console.log("server queue jumped past client queue, discard");
      break;
    }

    changed = changed || updateQueue(serverSong, server_i);
  }

  while (serverQueue.length < clientQueue.length) {
    popQueue();
    changed = true;
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

  var youtubeThumbnail = document.createElement("img");
  youtubeThumbnail.className = "youtubeThumbnail";

  if (youtube.items.length > 0) {
    youtubeTitle.innerHTML = youtube.items[0].snippet.title;
    youtubeThumbnail.src = youtube.items[0].snippet.thumbnails.high.url;
  }

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
  queueEntry.appendChild(queueSong);
  queueEntry.appendChild(queueButton);
  queue.appendChild(queueEntry);

  clientQueue.push(serverSong);

  highlightStage = clientQueue.length - 1;
}

function updateQueue(serverSong, server_i) {
  var clientSong = clientQueue[server_i];
  if (clientSong.name == serverSong.name && clientSong.type == serverSong.type) {
    clientSong.subtitles = serverSong.subtitles;
    clientSong.furigana = serverSong.furigana;
    try {
      clientSong.parsedFurigana = JSON.parse(clientSong.furigana);
    } catch (err) {
      //do nothing
      clientSong.parsedFurigana = null;
    }
    return false;
  }

  var clientEntry = document.getElementById("queue_" + server_i);
  var clientParent = clientEntry.parentNode;
  clientParent.removeChild(clientEntry);

  var newEntry = buildQueueSong(serverSong, server_i);
  clientParent.appendChild(newEntry);

  clientQueue[server_i] = serverSong;
  return true;
}

function popQueue() {
  var clientSong = clientQueue.pop();
  var clientEntry = document.getElementById("queueEntry_" + clientQueue.length);
  clientEntry.parentNode.removeChild(clientEntry);
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

function canSetCurrent() {
  return true;
}

function setCurrent() {
  if (!canSetCurrent()) {
    return;
  }

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

function doActSong(action, id) {
  var address = "actSong.php?queue_id=" + queue_id +
    "&act=" + action + "&id=" + id;
  httpRequest(address, reloadQueue);
}

function deleteSong() {
  var actIndex = getActIndex();
  if (actIndex >= 0 && actIndex < clientQueue.length) {
    doActSong("delete", clientQueue[actIndex].id);

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
    doActSong("raise", clientQueue[actIndex].id);

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
    doActSong("lower", clientQueue[actIndex].id);

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
  var tag = event.path[0];
  if (["INPUT", "TEXTAREA"].indexOf(tag.tagName) > -1) {
    return true;
  }

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
    return false;
  } else if (key == "n") {
    lowerSong();
  } else if (key == "p") {
    raiseSong();
  } else if (key == "?") {
    displayHelp();
  } else if (typeof handleKey == "function") {
    return handleKey(key);
  }

  return true;
}

function displayHelp() {
  var help = document.getElementById("help").style.visibility;
  if (help == "visible") {
    help = "hidden";
  } else {
    help = "visible";
  }
  document.getElementById("help").style.visibility = help;
}

function updateButtons(dontScroll) {
  var scrollToId = -1;
  var scrollToCurrent = false;
  var buttons = document.getElementsByClassName("queueButton");
  for (var i=0; i<buttons.length; i++) {
    var queueButton = buttons[i];
    queueButton.className = queueButton.className.replace("queueButtonCurrent", "");
    queueButton.className = queueButton.className.replace("queueButtonHighlight", "");
    queueButton.className = queueButton.className.trim();
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
    autoShowSidebar();
  }
}

function updateStage() {
  if (typeof doUpdateStage == "function") {
    doUpdateStage();
  }

  updateButtons();
}

function incrementStage() {
  if (currentStage + 1 >= clientQueue.length) {
    return;
  }
  currentStage++;
  highlightStage = -1;
  updateStage();
}

function getSidebarContainer() {
  return document.getElementById("sidebarContainer");
}

function showSidebar() {
  var sidebarContainer = getSidebarContainer();
  if (sidebarContainer) {
    sidebarContainer.className = "sidebarContainerHover";
  }

  if (typeof getStage == "function") {
    var stage = getStage();
    stage.className = "stageHover";
  }
}

function hideSidebar() {
  var sidebarContainer = getSidebarContainer();
  if (sidebarContainer) {
    sidebarContainer.className = "sidebarContainer";
  }

  if (typeof getStage == "function") {
    var stage = getStage();
    stage.className = "stage";
  }
}

function sidebarContainerOnMouseOver() {
  sidebarContainerHasMouse = true;
  showSidebar();
}

function sidebarContainerOnMouseOut() {
  sidebarContainerHasMouse = false;
  autoHideSidebar();
}

function autoShowSidebar() {
  sidebarContainerLastInputTime = Date.now();
  showSidebar();
  setTimeout(autoHideSidebar, 5000);
}

function autoHideSidebar() {
  if (!sidebarContainerHasMouse && Date.now() >= sidebarContainerLastInputTime + 4000) {
    hideSidebar();
  }
}

run(reloadQueue, 1000);
