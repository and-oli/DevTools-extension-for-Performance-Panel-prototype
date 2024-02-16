
console.log("Performance panel Extension loaded");

await chrome.devtools.performance.onProfilingStarted.addListener(() => {
  console.log("Profiling started");
});

await chrome.devtools.performance.onProfilingStopped.addListener(() => {
  console.log("Profiling stopped");
  const backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page",
  });

  backgroundPageConnection.postMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    command: "INJECT_SCRIPT",
    scriptToInject: "content_script.js",
  });
  backgroundPageConnection.onMessage.addListener(function (message) {
    if (message.command === "FETCH_RESPONSE") {
      registerPluginData(message.data);
      return;
    }
  });
  // Wait some time to ensure the data is finished being processed
  // by the server after profiling was stopped.
  setTimeout(() => {
    backgroundPageConnection.postMessage({
      command: "FETCH_DATA",
      tabId: chrome.devtools.inspectedWindow.tabId,
    });
  }, 1500);
});

await chrome.devtools.performance.onProfileParsed.addListener((_profile) => {
  console.log("Profile parsed");
});

function registerPluginData(data) {
  const { timings, timeOrigin } = data;
  const entries = timings.map((timing) => ({
    time: timing.starttime,
    duration: timing.endtime - timing.starttime,
    name: timing.name,
    color: timing.color,
    group: timing.groupname,
    description: timing.description,
  }));

  chrome.devtools.performance.registerPerformanceExtensionData(
    new ExtensionPlugin(timeOrigin, entries),
    "Corgi Collage Backend Extension",
  );
}
class ExtensionPlugin {
  constructor(timeOrigin, entries) {
    this.timeOrigin = timeOrigin;
    this.flameChartData = {
      flameChartEntries: entries,
    };
  }
}
