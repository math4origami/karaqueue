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
  var timeout = function() {
    callback();
    setTimeout(timeout, interval);
  }
  timeout();
}

function httpRequest(url, callback, errorCallback) {
  httpRequestPost(url, null, callback, errorCallback);
}

function httpRequestPost(url, post, callback, errorCallback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState != 4) {
      return;
    }
    if (xmlHttp.status == 200) {
      if (callback != null) {
        callback(xmlHttp.responseText);
      }
    } else {
      if (errorCallback != null) {
        errorCallback();
      }
    }
    xmlHttp.onreadystatechange = null;
  }
  if (post != null) {
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

function pushAll(array1, array2) {
  for (var element of array2) {
    array1.push(element);
  }
}

function unshiftAll(array1, array2) {
  array2.reverse();
  for (var element of array2) {
    array1.unshift(element);
  }
}

function last(array) {
  return array[array.length - 1];
}

function isEnter(event) {
  return event.key == "Enter";
}

function mobileDoubleTap(element, callback) {
  var timer = null;
  element.ontouchend = (event) => {
    if (timer == null) {
      timer = setTimeout(() => timer = null, 500);
    } else {
      timer = null;
      callback(event);
      event.preventDefault();
    }
  };
}
