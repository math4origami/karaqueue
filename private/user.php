<?php
include_once "mysql.php";
include_once "id.php";

class User {
  public $id;
  public $queue_id;
  public $name;
  public $cookie_id;
  public $created_time;

  public static function load($id = 0) {
    $id = (int)$id;
    $db = KaraqueueDB::instance();
    $result = $db->query("SELECT * FROM users WHERE id=$id");
    if ($row = $result->fetch_assoc()) {
      $user = new User();
      foreach ($row as $key => $value) {
        $user->$key = $value;
      }
      return $user;
    }
    return null;
  }

  public static function add() {
    $db = KaraqueueDB::instance();
    for ($try = 0; $try < 3; $try++) {
      $id = Id::generate();
      $result = $db->query("INSERT INTO users (id, name, queue_id) VALUES ($id->value, '', 0)");
      if ($result) {
        return self::load($id->value);
      }
    }
    error_log("Could not add user.");
    return null;
  }

  public function update() {
    $db = KaraqueueDB::instance();
    $id = (int)$this->id;
    $queue_id = (int)$this->queue_id;
    $db->query("UPDATE users SET queue_id=$queue_id WHERE id=$id");
  }
}

