<?php
include_once "utils.php";

class UserCookie {
  public $userId;
  public $cookieId;

  const KARAQUEUE_USER_ID = "karaqueueUserId";
  const KARAQUEUE_COOKIE_ID = "karaqueueCookieId";
  const EXPIRATION = 2147483647;

  public static function load() {
    $cookie = new UserCookie();
    $cookie->userId = idx($_COOKIE, self::KARAQUEUE_USER_ID);
    $cookie->cookieId = idx($_COOKIE, self::KARAQUEUE_COOKIE_ID, 0);
    return $cookie;
  }

  public function update() {
    setcookie(self::KARAQUEUE_USER_ID, $this->userId, self::EXPIRATION);
    setcookie(self::KARAQUEUE_COOKIE_ID, $this->cookieId, self::EXPIRATION);
  }
}
