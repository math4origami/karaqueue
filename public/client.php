<?php
include_once "id.php";
include_once "userManager.php";
include_once "queueManager.php";

class Client {
  public $queueId;
  public $encodedQueueId;

  public static function getUserQueue() {
    $userManager = new UserManager();
    $queueManager = new QueueManager();
    $client = new Client();

    $user = $userManager->loadUser();
    if ($user) {
      $client->setQueue($queueManager->getUserQueue($user));
    } else {
      $client->setQueue(null);
    }

    return $client;
  }

  public static function getOrAddQueue() {
    $userManager = new UserManager();
    $queueManager = new QueueManager();
    $client = new Client();

    $user = $userManager->loadOrAddUser();
    $client->setQueue($queueManager->getOrAddQueue($user));
    return $client;
  }

  public static function addUserQueue() {
    $userManager = new UserManager();
    $queueManager = new QueueManager();
    $client = new Client();

    $user = $userManager->loadOrAddUser();
    $client->setQueue($queueManager->addUserQueue($user));
    return $client;
  }

  public static function setUserQueue($encodedQueueId) {
    $userManager = new UserManager();
    $queueManager = new QueueManager();
    $client = new Client();

    $user = $userManager->loadOrAddUser();
    $client->setQueue($queueManager->setUserQueue($user, $encodedQueueId));
    return $client;
  }

  private function setQueue($queue) {
    if ($queue) {
      $this->queueId = $queue->id;
      $id = Id::encode($queue->id);
      $this->encodedQueueId = $id->encoded;
    } else {
      $this->queueId = 0;
      $this->encodedQueueId = "";
    }
  }
}