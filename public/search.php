<?php include_once "../private/youtube.php"; ?>
<script type="text/javascript" src="scripts/search.js"></script>

<div id="searchOptions"></div>

<input type="text" class="searchInput" id="searchInput" onkeypress="pressedSearch(this, event)"/>

<div class="searchResults">
  <div id="youtubeResults"></div><div id="nicovideoResults"></div>
</div>

<script type="text/javascript">
createSearchOptions();
createAutoscroll();
</script>