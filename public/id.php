<?php
include_once "utils.php";

class Id {
  public $value;
  public $encoded;

  public static function generate() {
    return Id::encode(Id::random());
  }

  public static function encode($value) {
    $id = new Id();
    $id->value = $value;
    $id->encoded = Id::encodeValue($id->value);
    return $id;
  }

  public static function decode($encoded) {
    $id = new Id();
    $id->value = $id->decodeValue($encoded);
    $id->encoded = $encoded;
    return $id;
  }

  private static function random() {
    return mt_rand(1, 2147483647);
  }

  private static function encodeValue($value) {
    $encoded = "";
    for ($i = 0; $i < 6; $i++) {
      $bits = 63 & $value;
      $encoded = Id::char($bits) . $encoded;
      $value = $value >> 6;
    }
    return $encoded;
  }

  private static function decodeValue($encoded) {
    $value = 0;
    for ($i = 0; $i < 6; $i++) {
      $value = $value << 6;
      $value += Id::bits($encoded[0]);
      $encoded = substr($encoded, 1);
    }
    return $value;
  }

  private static function char($bits) {
    if ($bits < 0 || $bits >= 64) {
      $bits = 0;
    }
    return Id::$chars[$bits];
  }

  private static function bits($char) {
    $bits = strpos(Id::$chars, $char);
    return $bits === false ? 0 : $bits;
  }

  private static $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
}
