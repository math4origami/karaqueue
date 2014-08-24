function getArgs() {
  var args = {};
  var search = window.location.search;
  if (search.length > 0) {
    search = search.substr(1);
    var pairs = search.split("&");
    for (var i in pairs) {
      var tags = pairs[i].split("=");
      args[tags[0]] = tags[1];
    }
  }
  return args;
}

function removeAllChildren(node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

function run(callback, interval) {
  callback();
  setInterval(callback, interval);
}

function httpRequest(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState==4 && xmlHttp.status==200) {
      if (callback) {
        callback(xmlHttp.responseText);
      }
      xmlHttp.onreadystatechange = null;
    }
  }
  xmlHttp.open("GET", url, true);
  xmlHttp.send();
}
