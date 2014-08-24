
var webSql = openDatabase('nicokara', '1.0', 'nicokara', 1024 * 1024);

function query(command, args, callback) {
  webSql.transaction(function (tx) {
    tx.executeSql(command, args, 
      function (tx, res) {
        if (callback) {
          callback(res);
        }
      }, function(tx, err) {
        console.log(err);

        var output = document.getElementById("webSqlOutput");
        output.innerHTML += err.message + "\n";
      }
    );
  })
}

function createWebSql() {
  query("DROP TABLE IF EXISTS `queued_song`");
  query("CREATE TABLE IF NOT EXISTS `queued_song` ( \
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, \
    `queue_id` int(11) NOT NULL, \
    `queue_index` int(11) NOT NULL, \
    `type` int(11) NOT NULL DEFAULT '0', \
    `name` varchar(255) NOT NULL DEFAULT '', \
    `timestamp` timestamp DEFAULT CURRENT_TIMESTAMP \
  );", [], 
    function (res) {
      console.log(res);
    }
  );
}

function localGetQueue(callback) {
  query("SELECT * FROM queued_song WHERE queue_id=0 ORDER BY queue_index", [], 
    function (results) {
      var queue = [];
      var len = results.rows.length;
      for (var i=0; i<len; i++) {
        queue.push(results.rows.item(i));
      }
      if (callback) {
        callback(queue);
      }
    }
  );
}

var localInsertSong = function (name, callback) {
  function afterQueue(queue) {
    var max = -1;
    for (var i in queue) {
      var song = queue[i];
      if (song.queue_index > max) {
        max = song.queue_index;
      }
    }
    query("INSERT INTO queued_song (queue_id, queue_index, name) \
        VALUES (0, ?, ?)", [max + 1, name], function () {
          if (callback) {
            callback();
          }
        });
  }
  localGetQueue(afterQueue);
};

function localDeleteSong(id, callback) {
  query("DELETE FROM queued_song WHERE id = ?", [id], function () {
    if (callback) {
      callback();
    }
  });
}

var localRaiseSong = function (id, callback) {
  function afterQueue(queue) {
    var done = 0;
    function finished() {
      done++;
      if (done == 2 && callback) {
        callback();
      }
    }
    var found = false;
    for (var i=1; i<queue.length; i++) {
      var song = queue[i];
      if (song.id == id) {
        var other = queue[i-1];
        query("UPDATE queued_song SET name=?, type=? WHERE id=?", [other.name, other.type, id], finished);
        query("UPDATE queued_song SET name=?, type=? WHERE id=?", [song.name, song.type, other.id], finished);
        found = true;
      }
    }
    if (!found && callback) {
      callback();
    }
  }
  localGetQueue(afterQueue);
};

var localLowerSong = function (id, callback) {
  function afterQueue(queue) {
    var done = 0;
    function finished() {
      done++;
      if (done == 2 && callback) {
        callback();
      }
    }
    var found = false;
    for (var i=0; i<queue.length-1; i++) {
      var song = queue[i];
      if (song.id == id) {
        var other = queue[i+1];
        query("UPDATE queued_song SET name=?, type=? WHERE id=?", [other.name, other.type, id], finished);
        query("UPDATE queued_song SET name=?, type=? WHERE id=?", [song.name, song.type, other.id], finished);
        found = true;
      }
    }
    if (!found && callback) {
      callback();
    }
  }
  localGetQueue(afterQueue);
};

function testInsert() {
  localInsertSong(document.getElementById("nameField").value, testQueue);
}

function testQueue() {
  localGetQueue(printQueue);
}

function printQueue(queue) {
  var output = document.getElementById("webSqlOutput");
  for (var i in queue) {
    var song = queue[i];
    output.innerHTML += song.id+" "+song.queue_id+" "+song.queue_index+" "+song.type+" "+
      song.name+" "+song.timestamp+"\n";
  }
  output.innerHTML += "\n";
}

function testDelete() {
  localDeleteSong(document.getElementById("idField").value, testQueue);
}

function testRaise() {
  localRaiseSong(document.getElementById("idField").value, testQueue);
}

function testLower() {
  localLowerSong(document.getElementById("idField").value, testQueue);
}
