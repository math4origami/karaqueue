var joinValue = "";

function isValidInput(string) {
  return /^[\w-_]*$/.test(string) && string.length <= 6;
}

function displayError(text) {
  var error = document.getElementById("joinTheaterError");
  error.innerHTML = text;
  error.style.visibility = "visible";
}

function hideError() {
  var error = document.getElementById("joinTheaterError");
  error.innerHTML = "";
  error.style.visibility = "hidden";
}

function pressedJoin(input, event) {
  if (!isEnter(event)) {
    return;
  }
  if (input.value.length != 6) {
    displayError("Queue id must be 6 characters.");
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

function checkError() {
  var join_queue_error = parseSearch("join_queue_error");
  if (join_queue_error) {
    displayError("Queue with id \"" + join_queue_error + "\" does not exist.");
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