<?php
include_once "user.php";
include_once "userCookie.php";

class UserManager {
  public function loadOrAddUser() {
    $cookie = UserCookie::load();

    if ($cookie->userId) {
      $id = Id::decode($cookie->userId);
      $user = User::load($id->value);
      if ($user) {
        return $user;
      }
    }

    $user = User::add();
    $id = Id::encode($user->id);
    $cookie->userId = $id->encoded;
    $cookie->update();
    return $user;
  }
}
