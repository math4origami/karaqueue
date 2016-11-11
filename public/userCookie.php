<?php
include_once "utils.php";

class UserCookie {
  const KARAQUEUE_USER_ID = "karaqueueUserId";
  const KARAQUEUE_COOKIE_ID = "karaqueueCookieId";

  public function getUserId() {
    return idx($_COOKIE, self::KARAQUEUE_USER_ID);
  }

  public function setUserId($userId) {
    setcookie(self::KARAQUEUE_USER_ID, $userId, time()+60*60*24*30);
  }

  public function getCookieId() {
    return idx($_COOKIE, self::KARAQUEUE_COOKIE_ID, 0);
  }

  public function setCookieId($cookieId) {
    setcookie(self::KARAQUEUE_COOKIE_ID, $cookieId, time()+60*60*24*30);
  }
}
