<?php
include_once "id.php";
include_once "userManager.php";
include_once "queueManager.php";

class Client {
  public $queueId = 0;
  public $encodedQueueId = "";

  public static function getUserQueue() {
    $userManager = new UserManager();
    $queueManager = new QueueManager();
    $client = new Client();

    $user = $userManager->loadUser();
    if ($user) {
      $client->setQueue($queueManager->getQueue($user->queue_id));
    }
    return $client;
  }

  public static function getSearchOrUserQueue() {
    $queueManager = new QueueManager();

    if ($queueManager->hasSearchQueue()) {
      $client = new Client();
      $queue = $queueManager->getSearchQueue();

      if ($queue) {
        $client->setQueue($queue);
      } else {
        $client->encodedQueueId = $queueManager->getSearchQueueId();
      }
      return $client;
    }

    return self::getUserQueue();
  }

  public static function getOrAddUserQueue() {
    $userManager = new UserManager();
    $queueManager = new QueueManager();

    $user = $userManager->loadOrAddUser();
    $queue = $queueManager->getQueue($user->queue_id);
    if ($queue) {
      $client = new Client();
      $client->setQueue($queue);
      return $client;
    }

    return self::addUserQueue($user);
  }

  public static function addUserQueue($user = null) {
    if (!$user) {
      $userManager = new UserManager();
      $user = $userManager->loadOrAddUser();
    }
    $queue = Queue::add();

    $client = new Client();
    $client->updateUser($user, $queue);
    $client->setQueue($queue);
    return $client;
  }

  public static function setUserQueue() {
    $queueManager = new QueueManager();
    $client = new Client();

    $queue = $queueManager->getSearchQueue();
    if ($queue) {
      $userManager = new UserManager();
      $user = $userManager->loadOrAddUser();
      $client->updateUser($user, $queue);
      $client->setQueue($queue);
    } else {
      $client->encodedQueueId = $queueManager->getSearchQueueId();
    }

    return $client;
  }

  public function fixUrl() {
    return "<script type='text/javascript'>" .
           "var path = window.location.pathname + '?queue_id=$this->encodedQueueId';" .
           "window.history.replaceState({}, document.title, path);" .
           "</script>";
  }

  private function updateUser($user, $queue) {
    if ($user && $queue) {
      $user->queue_id = $queue->id;
      $user->update();
    }
  }

  private function setQueue($queue) {
    if ($queue) {
      $this->queueId = $queue->id;
      $id = Id::encode($queue->id);
      $this->encodedQueueId = $id->encoded;
    }
  }
}