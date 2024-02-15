
async function sendFetchData(sendResponse) {
    const response = await fetch('/api/timings', {cache: "no-store"});
    const jsonData = await response.json();
    sendResponse({command: 'FETCH_RESPONSE', data: jsonData});
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.command === 'FETCH_DATA') {
        sendFetchData(sendResponse);
        return true;
    }
  });


