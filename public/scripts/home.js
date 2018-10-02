var joinValue = "";

function isValidInput(string) {
  return /^[\w-_]*$/.test(string) && string.length <= 6;
}

function pressedJoin(input, event) {
  if (!isEnter(event)) {
    return;
  }
  if (input.value.length != 6) {
    var error = document.getElementById("joinTheaterError");
    error.innerHTML = "Queue ids must be 6 characters.";
    error.style.visibility = "visible";
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
    error.innerHTML = "Queue with id \"" + join_queue_error + "\" does not exist.";
    error.style.visibility = "visible";
    window.history.replaceState({}, document.title, window.location.origin);
  }
}

function createGoTheater(queue_id) {
  if (document.getElementById("goTheater") != null) {
    return;
  }

  var a = document.createElement("a");
  a.id = "goTheater";
  a.href = "theater.php?queue_id=" + queue_id;
  var div = document.createElement("div");
  div.className = "actionButton";
  div.innerHTML = "Go to your Queue";

  a.appendChild(div);
  var actionButtons = document.getElementById("actionButtons");
  actionButtons.insertBefore(a, actionButtons.firstChild);
  fixNewTheater();
}

function fixNewTheater() {
  if (document.getElementById("goTheater") == null) {
    return;
  }

  var newTheater = document.getElementById("newTheater");
  var joinTheater = document.getElementById("joinTheater");
  var actionBarRight = document.getElementById("actionBarRight");
  actionBarRight.insertBefore(newTheater, joinTheater);
  newTheater.firstChild.classList.add("actionButtonRight");
}