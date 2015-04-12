<?php
include_once "mysql.php";

class Song {
  public $id;
  public $type;
  public $name;
  public $subtitles;
  public $timestamp;

  public static function load($id) {
    $db = KaraqueueDB::instance();
    $result = $db->query("SELECT * FROM songs WHERE id=$id");
    if ($row = $result->fetch_assoc()) {
      $song = new Song();
      foreach ($row as $key => $value) {
        $song->$key = $value;
      }
      return $song;
    }
    return null;
  }

  public static function loadByType($type, $name) {
    $db = KaraqueueDB::instance();
    $result = $db->query("SELECT * FROM songs WHERE type='$type' AND name='$name'");
    if ($row = $result->fetch_assoc()) {
      $song = new Song();
      foreach ($row as $key => $value) {
        $song->$key = $value;
      }
      return $song;
    }
    return null;
  }

  public static function getSongByType($type, $name) {
    $result = self::loadByType($type, $name);
    if ($result) {
      return $result;
    }
    $song = new Song();
    $song->type = $type;
    $song->name = $name;
    $song->insert();
    $result = self::loadByType($type, $name);
    return $result;
  } 

  public function insert() {
    $db = KaraqueueDB::instance();
    $pairs = get_object_vars($this);
    unset($pairs['id']);
    unset($pairs['timestamp']);
    $keys = implode(",", array_keys($pairs));
    $values = implode("','", array_values($pairs));
    $query = "INSERT INTO songs ($keys) VALUES ('$values')";
    $db->query($query);
  }

  public function update() {
    $db = KaraqueueDB::instance();
    $id = $this->id;
    $subtitles = $this->subtitles;
    $db->query("UPDATE songs SET subtitles=$subtitles WHERE id=$id");
  }
}