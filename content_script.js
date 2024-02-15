
async function sendFetchData(sendResponse) {
    const clientStartForClockSync = performance.now() + performance.timeOrigin;
    const response = await fetch('/api/timings', {cache: "no-store"});
    const clientEndForClockSync = performance.now() + performance.timeOrigin;
    const jsonData = await response.json();
    const {serverStartForClockSync, serverEndForClockSync} = jsonData;
    // Naive NTP based on https://en.wikipedia.org/wiki/Network_Time_Protocol#Clock_synchronization_algorithm
    const roundtripTime = clientEndForClockSync - clientStartForClockSync;
    const serverProcessingTime = serverEndForClockSync - serverStartForClockSync;
    const averageNetworkDelay = (roundtripTime - serverProcessingTime) / 2;
    const serverClientTimeOffset = serverStartForClockSync - clientStartForClockSync - averageNetworkDelay;
    const timingData = {timeOrigin: jsonData.timeOrigin - serverClientTimeOffset, timings: jsonData.timings};
    sendResponse({command: 'FETCH_RESPONSE', data: timingData});
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.command === 'FETCH_DATA') {
        sendFetchData(sendResponse);
        return true;
    }
  });


