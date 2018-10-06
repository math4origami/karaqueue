<?php
include_once "strings.php";
include_once "youtube.php";
?>
<script type="text/javascript" src="scripts/search.js"></script>

<a href="/" id="bookmarkletLink" title="<?= Strings::BOOKMARKLET_DESCRIPTION ?>">
  <div class="bookmarklet">
    <img id="bookmarkletImg" src="images/baseline_bookmark_black_36dp.png">
    <p id="bookmarkletText"></p>
  </div>
</a>
<div id="searchOptions"></div>
<input type="text" class="searchInput" id="searchInput" onkeypress="pressedSearch(this, event)"/>

<div class="searchResults">
  <div id="youtubeResults"></div><div id="nicovideoResults"></div>
</div>

<script type="text/javascript">
createSearchOptions();
createAutoscroll();
createBookmarklet();
</script>