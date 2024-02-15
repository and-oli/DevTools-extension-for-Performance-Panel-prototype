# devtools.performance implementation prototype

This code is part of a proof of concept of a framework that enables third parties to extend the
Chrome DevTools Performance Panel using a proposed new subset of APIs in the [DevTools extension API](https://developer.chrome.com/docs/extensions/how-to/devtools/extend-devtools]) under the namespace `devtools.performance`.

The concept being prototyped is the ability to add content to the Chrome DevTools Performance Panel
using the new API. In particular, adding custom tracks to the timeline that supports all the
features of the native tracks (f.e. entries in a track can be clicked to reveal a detailed view).

This repository in particular contains a devtools extension that prototypes the usage of the 
proposed API. 
 
 basic web app built with Next JS that takes measurements
of arbitrary tasks run in the server side code which are then made available for consumption to the
client.

https://github.com/and-oli/corgi-collage-nextjs