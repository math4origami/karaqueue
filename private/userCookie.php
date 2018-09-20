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
    $cookie->cookieId = idx($_COOKIE, self::KARAQUEUE_COOKIE_ID);
    return $cookie;
  }

  public function update() {
    $domain = $this->getDomain();
    setcookie(self::KARAQUEUE_USER_ID, $this->userId, self::EXPIRATION, '/', $domain);
    setcookie(self::KARAQUEUE_COOKIE_ID, $this->cookieId, self::EXPIRATION, '/', $domain);
  }

  private function getDomain() {
    $host = $_SERVER['HTTP_HOST'];
    if (strpos($host, 'localhost') !== false) {
      return "localhost";
    } else {
      return ".karaqueue.com";
    }
  }
}