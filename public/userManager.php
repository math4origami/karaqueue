<?php
include_once "id.php";
include_once "user.php";
include_once "userCookie.php";

class UserManager {
  public function loadUser() {
    $cookie = UserCookie::load();

    if ($cookie->userId) {
      $id = Id::decode($cookie->userId);
      return User::load($id->value);
    }
    return null;
  }

  public function loadOrAddUser() {
    if ($user = $this->loadUser()) {
      return $user;
    }

    $user = User::add();
    $id = Id::encode($user->id);
    $cookie = UserCookie::load();
    $cookie->userId = $id->encoded;
    $cookie->update();
    return $user;
  }
}