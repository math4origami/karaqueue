function openAddSongPage(songPageUrl) {
  chrome.tabs.getSelected(null, function(selected_tab) {
    chrome.tabs.create({
      url: songPageUrl,
      active: false,
      index: selected_tab.index + 1,
      windowId: selected_tab.windowId
    }, function (newTab) {
      var tabId = newTab.id;
      setTimeout(function () {
        chrome.tabs.remove(tabId);
      }, 2000);
    });
  });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  openAddSongPage(message.url);
});
