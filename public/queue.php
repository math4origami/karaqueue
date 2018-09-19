<?php
include_once "mysql.php";
include_once "id.php";

class Queue {
  public $id;
  public $name;
  public $timestamp;

  public static function load($id) {
    $id = (int)$id;
    $db = KaraqueueDB::instance();
    $result = $db->query("SELECT * FROM queues WHERE id=$id");
    if ($row = $result->fetch_assoc()) {
      $queue = new Queue();
      foreach ($row as $key => $value) {
        $queue->$key = $value;
      }
      return $queue;
    }
    return null;
  } 

  public static function add() {
    $db = KaraqueueDB::instance();
    for ($try = 0; $try < 3; $try++) {
      $id = Id::generate();
      $result = $db->query("INSERT INTO queues (id, name) VALUES ($id->value, '')");
      if ($result) {
        return self::load($id->value);
      }
    }
    error_log("Could not add queue.");
    return null;
  }
}
