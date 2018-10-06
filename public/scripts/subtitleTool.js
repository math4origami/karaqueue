function getStageSubtitles() {
  var textarea = document.getElementById("stageSubtitlesTextarea");
  if (!textarea) {
    console.log("Error! Cannot find stageSubtitlesTextarea");
  }

  return textarea;
}

function canSetCurrent() {
  var clientSong = getClientSong();
  if (!clientSong) {
    return true;
  }

  var textarea = getStageSubtitles();
  if (!textarea) {
    return false;
  }

  var same = clientSong.subtitles == textarea.value;
  if (!same) {
    return confirm("The subtitles have changed.  Discard those changes without saving?");
  }

  return true;
}

function setStageDisabled(disabled) {
  var textarea = getStageSubtitles();
  if (textarea) {
    textarea.disabled = disabled;
  }

  var updateSong = document.getElementById("updateSong");
  if (updateSong) {
    updateSong.disabled = disabled;
  }
}

function doUpdateStage() {
  var clientSong = getClientSong();
  if (!clientSong) {
    return;
  }

  var textarea = getStageSubtitles();
  if (!textarea) {
    return;
  }

  textarea.value = clientSong.subtitles;
  setStageDisabled(false);
  textarea.focus();
}

function updateSong() {
  var clientSong = getClientSong();
  if (!clientSong) {
    return;
  }

  var textarea = getStageSubtitles();
  if (!textarea) {
    return;
  }

  if (clientSong.subtitles == textarea.value) {
   alert("No changes to update.");
  } else {
    httpRequestPost("updateSong.php?song_id="+clientSong.song_id, 
                    "subtitles="+encodeURIComponent(textarea.value),
                    updateSongCallback);
    setStageDisabled(true);
  }
}

function updateSongCallback(response) {
  alert(response);
  setStageDisabled(false);
}

function textareaKeyDown(event) {
  var key = String.fromCharCode(event.keyCode);
  if (event.keyCode == 27) {
    getStageSubtitles().blur();
  } else if ((key == "S" || key == "s") && event.ctrlKey) {
    updateSong();
    return false;
  }

  return true;
}

function handleKey(key) {
  if (key == "s") {
    updateSong();
  }
}
