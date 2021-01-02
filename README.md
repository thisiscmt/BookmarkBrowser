Bookmark Browser
===============
This web application is for accessing Firefox bookmarks from a mobile device. It mimics the functionality of the former Firefox Home iOS app. My inspiration for it was a bug in Firefox Home that caused it to randomly re-arrange my bookmark ordering after I would add a new one from my desktop machine or laptop.

Version 1.0 was built on [KnockoutJS](http://knockoutjs.com/) and used the [FxSyncNet](https://github.com/pieterderycke/FxSyncNet) wrapper to access Sync storage directly, via an ASP.NET back end. Version 2.0 was based on [AngularJS](https://angularjs.org) and didn't attempt to connect to any Sync APIs. The issue I kept running into was Mozilla would constantly change the login API such that I couldn't authenticate and grab bookmark data in the background.

Version 3.0 is basically a tech stack upgrade: the front end is now based on React.js and the back end is based on ASP.NET Core. The current back end allows a backup of your Firefox bookmarks in JSON form to be uploaded to a server, and then provdes a way to download that data to your mobile device. All bookmark data is stored in browser local storage to allow fast and easy navigation through it. The app also has an option to return to the last directory you were at in the bookmark hierarchy the next time you browse to the app.

Future state:

Mozilla has said they want to provide a nicer way for third-party apps to authenticate a Firefox account so they can access Sync data, likely via via OAuth. I don't know the current state of play but it would be nice to avoid the extra steps to update the data on your device, as well as have the capability of adding a new bookmark via the app. Both of those features on on the roadmap.

Postscript:

Mozilla did finally develop a version of [Firefox for iOS](https://www.mozilla.org/en-US/firefox/mobile). The initial versions were not good, the UX was clunky and painful to use. Later editions are vastly improved but I'm going to stick to mobile Safari. It still wins out slightly in usability (the way you access bookmarks in Firefox for iOS is not ideal), and its performance is quite good.
