<?php
include_once "mysql.php";

class Constant {
  public $id;
  public $constant_key;
  public $value;
  public $timestamp;

  public static function load($key = "") {
    $db = KaraqueueDB::instance();
    $result = $db->query("SELECT * FROM constants WHERE constant_key=\"$key\"");
    if ($row = $result->fetch_assoc()) {
      $constant = new Constant();
      foreach ($row as $key => $value) {
        $constant->$key = $value;
      }
      return $constant;
    }
    return null;
  }
}

