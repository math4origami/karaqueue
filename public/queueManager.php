<?php
include_once "id.php";
include_once "queue.php";

class QueueManager {
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