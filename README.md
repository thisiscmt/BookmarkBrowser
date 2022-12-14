Bookmark Browser
===============
This web application is for accessing Firefox bookmarks from a mobile device. It mimics the functionality of the former Firefox Home iOS app. My inspiration for it was a bug in Firefox Home that caused it to randomly re-arrange my bookmark ordering after I would add a new one from my desktop machine or laptop.

Version 1.0 was built on [KnockoutJS](http://knockoutjs.com/) and used the [FxSyncNet](https://github.com/pieterderycke/FxSyncNet) wrapper to access Sync storage directly, via an ASP.NET web API back end. Version 2.0 was based on [AngularJS](https://angularjs.org) and didn't attempt to connect to any Sync APIs. Instead it allowed you to upload a backup of your Firefox bookmarks in JSON form to a server, and then provided a way to download that data to your mobile device. The issue I kept running into was Mozilla would constantly change the login API such that I couldn't authenticate and grab bookmark data in the background.

Version 3.0 is a tech stack upgrade and a return to accessing Sync services directly: the front end is now based on [React.js](https://reactjs.org) and the back end has been re-built as a [ASP.NET Core 6 web API](https://docs.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-6.0) service. All bookmark data is stored in browser storage to allow fast and easy navigation. The app also has an option to return to the last directory you were at in the bookmark hierarchy the next time you browse to the app.

Future state:

The back end is using legacy BrowserID support to access Sync services. It's possible to use OAuth for authentication but it would require coordination with Mozilla, which is far too great of a burden for me to try and use it. I plan to add the capability of adding a new bookmark via the app.

Postscript:

Mozilla did finally develop a version of [Firefox for iOS](https://www.mozilla.org/en-US/firefox/mobile). The initial versions were not good, the UX was clunky and painful to use. Later editions are vastly improved but I'm going to stick to mobile Safari. It still wins out slightly in usability (the way you access bookmarks in Firefox for iOS is not ideal), and its performance is quite good.
