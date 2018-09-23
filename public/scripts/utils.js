function getArgs(uri) {
  var args = {};
  if (!uri) {
    var search = window.location.search;
    if (search.length > 0) {
      uri = search.substr(1);
    }
  }
  if (uri) {
    var pairs = uri.split("&");
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
  // callback();
  // setInterval(callback, interval);
  var timeout = function() {
    callback();
    setTimeout(timeout, interval);
  }
  timeout();
}

function httpRequest(url, callback, post) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState==4 && xmlHttp.status==200) {
      if (callback) {
        callback(xmlHttp.responseText);
      }
      xmlHttp.onreadystatechange = null;
    }
  }
  if (post) {
    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send(post);
  } else {
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
  }
}

function now() {
  return (new Date()).getTime();
}

function getFirstElementByClassName(className, doc) {
  var arr;
  if (doc) {
    arr = doc.getElementsByClassName(className);
  } else {
    arr = document.getElementsByClassName(className);
  }
  if (arr.length > 0) {
    return arr[0];
  } else {
    return null;
  }
}

function getFirstElementByTagName(className, doc) {
  var arr;
  if (doc) {
    arr = doc.getElementsByTagName(className);
  } else {
    arr = document.getElementsByTagName(className);
  }
  if (arr.length > 0) {
    return arr[0];
  } else {
    return null;
  }
}

function parseSearch(key) {
  var args = {};
  var search = window.location.search.substr(1).split("&").forEach(function (item) {
    var tags = item.split("=");
    args[tags[0]] = decodeURIComponent(tags[1]);
  });
  if (key) {
    return args[key];
  } else {
    return args;
  }
}

function callObjFunction(obj, name, none, arg) {
  if (typeof obj[name] === "function") {
    if (arg == undefined) {
      return obj[name]();
    } else {
      return obj[name](arg);
    }
  }
  if (none !== undefined) {
    return none;
  } else {
    return null;
  }
}

function idx(obj, name, def = null) {
  if (typeof obj[name] != "undefined") {
    return obj[name];
  }
  return def;
}
