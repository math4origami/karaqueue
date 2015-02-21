<?php

$mysqli = new mysqli("localhost", "karaqueue", "contact80", "karaqueue");

class KaraqueueDb {
  private static $instance;

  public static function instance() {
    if (!self::$instance) {
      self::$instance = new KaraqueueDb();
    }
    return self::$instance;
  }

  private $mysqli;

  public function __construct() {
    $this->mysqli = new mysqli("localhost", "karaqueue", "contact80", "karaqueue");
  }

  public function __call($name, $arguments) {
    if (method_exists($this->mysqli, $name)) {
      return call_user_func_array(array($this->mysqli, $name), $arguments);
    } else {
      return parent::__call($name, $arguments);
    }
  }

  public function __get($name) {
    if (isset($this->mysqli->$name)) {
      return $this->mysqli->$name;
    } else {
      return parent::__get($name);
    }
  }
}