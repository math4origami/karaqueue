var joinValue = "";

function isEnter(event) {
  return event.key == "Enter";
}

function isValidInput(string) {
  return /^[\w-_]*$/.test(string) && string.length <= 6;
}

function pressedJoin(input, event) {
  if (!isEnter(event)) {
    return;
  }
  if (input.value.length != 6) {
    document.getElementById("joinTheaterError").innerHTML = "Queue ids must be 6 characters.";
    return;
  }
  window.location.href = "theater.php?join=1&queue_id=" + input.value;
}

function inputJoin(input, event) {
  if (!isValidInput(input.value)) {
    input.value = joinValue;
  }
  joinValue = input.value;
}

function createBookmarklet() {
  var siteLabel = "Karaqueue";
  if (window.location.host.indexOf("localhost") > -1) {
    siteLabel = "Localhost";
  }
  var div = document.getElementById("bookmarkletDiv");
  div.innerHTML = siteLabel + " Add Song";
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

function displayError() {
  var join_queue_error = parseSearch("join_queue_error");
  if (join_queue_error) {
    var error = document.getElementById("joinTheaterError");
    error.innerHTML = "Queue with id " + join_queue_error + " does not exist.";
    error.style.visibility = "visible";
    window.history.replaceState({}, document.title, window.location.origin);
  }
}
