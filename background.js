chrome.runtime.onConnect.addListener(function (devToolsConnection) {
  const devToolsListener = (message) => {
    if (message.command === "INJECT_SCRIPT") {
      chrome.scripting.executeScript({
        target: { tabId: message.tabId },
        files: [message.scriptToInject],
      });
    } else if (message.command === "FETCH_DATA") {
      chrome.tabs
        .sendMessage(message.tabId, { command: "FETCH_DATA" })
        .then((res) => {
          devToolsConnection.postMessage({
            command: "FETCH_RESPONSE",
            data: res.data,
          });
        });
    }
  };
  devToolsConnection.onMessage.addListener(devToolsListener);
});