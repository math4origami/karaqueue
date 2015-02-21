<?php
include_once "mysql.php";

class User {
  public $id;
  public $queue_id;
  public $name;
  public $created_time;

  public static function load($id = 0) {
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

  public function update() {
    $db = KaraqueueDB::instance();
    $id = $this->id;
    $queue_id = $this->queue_id;
    $db->query("UPDATE users SET queue_id=$queue_id WHERE id=$id");
  }
}

