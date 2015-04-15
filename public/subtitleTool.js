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
  textarea.disabled = false;

  var updateSong = document.getElementById("updateSong");
  updateSong.disabled = false;
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

  httpRequest("updateSong.php?song_id="+clientSong.song_id, updateSongCallback,
    "subtitles="+encodeURIComponent(textarea.value));
}

function updateSongCallback(response) {
  alert(response);
}
