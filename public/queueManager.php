<?php
include_once "id.php";
include_once "queue.php";

class QueueManager {
  public function getOrAddQueue($user) {
    $queue = $this->getSearchQueue();
    if ($queue) {
      return $queue;
    }

    $queue = $this->getUserQueue($user);
    if ($queue) {
      return $queue;
    }

    return $this->addUserQueue($user);
  }

  public function getSearchQueue() {
    if (!isset($_GET["queue_id"])) {
      return null;
    }

    $id = Id::decode($_GET["queue_id"]);
    if (!$id) {
      return null;
    }

    return Queue::load($id->value);
  }

  public function getUserQueue($user) {
    if (!$user->queue_id) {
      return null;
    }

    return Queue::load($user->queue_id);
  }

  public function addUserQueue($user) {
    $queue = Queue::add();
    if (!$queue) {
      return null;
    }

    $user->queue_id = $queue->id;
    $user->update();
    return $queue;
  }

  public function setUserQueue($user, $encodedQueueId) {
    $id = Id::decode($encodedQueueId);
    $queue = Queue::load($id->value);
    if (!$queue) {
      return null;
    }

    $user->queue_id = $queue->id;
    $user->update();
    return $queue;
  }
}