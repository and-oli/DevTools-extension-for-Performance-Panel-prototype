# devtools.performance implementation prototype

This code is part of a proof of concept of a framework that enables third parties to extend the
Chrome DevTools Performance Panel using a proposed new subset of APIs in the [DevTools extension API](https://developer.chrome.com/docs/extensions/how-to/devtools/extend-devtools]) under the namespace `devtools.performance`.

The concept being prototyped is the ability to add content to the Chrome DevTools Performance Panel
using the new API. In particular, adding custom tracks to the timeline that supports all the
features of the native tracks (f.e. entries in a track can be clicked to reveal a detailed view).

This repository in particular contains a devtools extension that prototypes the usage of the 
proposed API. It is supposed to be used with a website [example built with NextJS](https://github.com/and-oli/corgi-collage-nextjs) from which data is gathered and added to the Perfomance Panel as extension data using the proposed
`devtools.performance` api. 

# Data flow

The extension data consists of measurements taken in the server during the website server side
rendering on page load. It is assumed that once the website finishes loading these measurements have
been taken and are ready for consuption by the client (in this case via a public API, for the sake
of exemplifying). For this reason, the extension listens to the proposed DevTools extension event
`devtools.performance.onProfilingStopped` to fetch the extension data, since it's assumed that the
page starts loading during profiling and finishes before the profiling has been stopped in the
panel.

The extension uses a [background service worker](./background.js) that injects a [content script](./content_script.js).
This content script fetches the extension data from the public API on demand and passes the results
back to the caller. This way, once `devtools.performance.onProfilingStopped` has been dispatched,
the [extension](./DevToolsPlugin.js) calls the service worker to fetch the data, and this forwards
the request to the content script. The data is then passed back the chain and injected to DevTools
by the extension using the proposed `devtools.performance.registerPerformanceExtensionData` API.