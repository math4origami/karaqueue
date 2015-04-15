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
    $this->mysqli->set_charset("utf8");
  }

  public function __call($name, $arguments) {
    if (method_exists($this->mysqli, $name)) {
      $result = call_user_func_array(array($this->mysqli, $name), $arguments);
      if ($this->mysqli->error) {
        error_log(var_export($arguments, true));
        error_log($this->mysqli->error);
      }
      return $result;
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