// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    var url = activeTab.url;
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
    if(url.search('netflix.com/') == -1)
    	chrome.tabs.update({"url" : 'http://www.netflix.com'});
  });
});