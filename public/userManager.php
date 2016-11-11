<?php
include_once "user.php";
include_once "userCookie.php";

class UserManager {
  public function loadUser() {
    $userCookie = new UserCookie();
    $userId = $userCookie->getUserId();
    $cookieId = $userCookie->getCookieId();

    if (!empty($userId) && !empty($cookieId)) {
      $user = User::load($userId);
      if ($user->cookie_id == $cookieId) {
        return $user;
      }
    }


  }


}
