<?php

function idx($array, $key, $default = null) {
  if (isset($array[$key])) {
    return $array[$key];
  }
  return $default;
}
