const youtubeExtensionId = 'pfpolingmjapeepkjhnimfaofmlhhfbf'; 
const otherExtensionId = 'gaidoampbkcknofoejhnhbhbhhifgdop';
function toggleExtensions(onYouTube) {
  if (onYouTube) {
    chrome.management.setEnabled(youtubeExtensionId, true, () => {
      console.log('Включено расширение для YouTube');
    });
    chrome.management.setEnabled(otherExtensionId, false, () => {
      console.log('Отключено другое расширение на YouTube');
    });
  }else{
    chrome.management.setEnabled(youtubeExtensionId, false, () => {
      console.log('Отключено расширение для YouTube');
    });
    chrome.management.setEnabled(otherExtensionId, true, () => {
      console.log('Включено другое расширение вне YouTube');
    });
  }
}
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.includes("youtube.com")) {
      toggleExtensions(true);
    }else{
      toggleExtensions(false);
    }
  }
});
