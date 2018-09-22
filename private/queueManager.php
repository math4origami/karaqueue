<?php
include_once "id.php";
include_once "queue.php";
include_once "utils.php";

class QueueManager {
  public function hasSearchQueue() {
    return isset($_GET["queue_id"]);
  }

  public function getSearchQueueId() {
    return idx($_GET, "queue_id");
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

  public function getQueue($queueId) {
    if (!$queueId) {
      return null;
    }

    return Queue::load($queueId);
  }
}