<%@ Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="BookmarkBrowser._Default" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head runat="server">
    <title>Home</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="Styles/jquery-mobile-five-swatches.min.css"/>
    <link rel="stylesheet" href="Styles/jquery.mobile.icons.min.css"/>
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.1/jquery.mobile-1.4.1.min.css" />
    <link rel="stylesheet" href="Styles/Site.css"/>
</head>
<body>
    <div id="Home" data-role="page" data-title="Home" data-theme="c" class="mobilePage">
        <div data-role="header">
            <h5>Home</h5>
        </div>

        <div data-role="content">
            <div class="msgPanel">
                <span class="errorNotification"></span>
            </div>

            <div id="homePageContent">
                <div class="alignCenter">
                    <h4>Welcome to the Bookmark Browser</h4>
                </div>

                <div class="alignCenter smallText bottomPadding15">
                    Use this site to access your Sync bookmarks from a mobile device that isn't currently
                    supported by Firefox.<br /><br />
                        
                    Click Settings to set your Sync username and password. Once the information is 
                    saved, you can refresh the bookmark data at any time from the settings page.
                </div>
            </div>
        </div>

        <div id="homePageFooter" data-role="footer">
            <div data-role="navbar">
                <ul class="footerList">
                    <li>
                        <a href="#Home" data-role="button" data-icon="home">Home</a>
                    </li>
                    <li>
                        <a href="#Bookmarks" data-role="button" data-icon="star">Bookmarks</a>
                    </li>
                    <li>
                        <a href="#Settings" data-role="button" data-icon="gear">Settings</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div id="Bookmarks" data-role="page" data-title="Bookmarks" data-theme="c" class="mobilePage">
        <div data-role="header">
            <a id="backButton" href="#" data-role="button" onclick="doNavigation(this);">Back</a>
            <h5 id="bmHeader">Bookmarks</h5>
            <a id="topButton" href="#" data-role="button" onclick="doNavigation(this);">Top</a>
        </div>

        <div data-role="content" class="smallText">
            <div class="msgPanel">
                <span class="errorNotification"></span>
            </div>

            <div id="bookmarkContainer">
                <ul id="bmMain" class="bookmarkList" data-role="listview">
                    <li id="toolbarDivider" data-theme="e" data-role="list-divider">Bookmarks Toolbar</li>
                    <!-- ko foreach: {data: BookmarksToolbar} -->
                    <li data-bind="bookmarkItemType: ItemType" data-icon="false">
                        <div class="imageBlock">
                            <img alt="Item icon" class="ui-li-icon" src="" />
                        </div>
                        <div class="nameAndLocationBlock">
                            <a data-bind="attr: { 'data-nodepath': Path, href: Location }" class="noUnderline">
                                <div class="nameBlock">
                                </div>
                                <div class="locationBlock">
                                </div>
                            </a>
                        </div>
                    </li>
                    <!-- /ko -->

                    <li id="menuDivider" data-theme="e" data-role="list-divider">Bookmarks Menu</li>
                    <!-- ko foreach: {data: BookmarksMenu} -->
                    <li data-bind="bookmarkItemType: ItemType" data-icon="false">
                        <div class="imageBlock">
                            <img alt="Item icon" class="ui-li-icon" src="" />
                        </div>
                        <div class="nameAndLocationBlock">
                            <a data-bind="attr: { 'data-nodepath': Path, href: Location }" class="noUnderline">
                                <div class="nameBlock">
                                </div>
                                <div class="locationBlock">
                                </div>
                            </a>
                        </div>
                    </li>
                    <!-- /ko -->
                </ul>
            </div>
        </div>

        <div data-role="footer">
            <div data-role="navbar">
                <ul class="footerList">
                    <li>
                        <a href="#Home" data-role="button" data-icon="home">Home</a>
                    </li>
                    <li>
                        <a href="#Bookmarks" data-role="button" data-icon="star">Bookmarks</a>
                    </li>
                    <li>
                        <a href="#Settings" data-role="button" data-icon="gear">Settings</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div id="Settings" data-role="page" data-title="Settings" data-theme="c" class="mobilePage">
        <div data-role="header">
            <h5>Settings</h5>
        </div>

        <div data-role="content" class="smallText">
            <div class="msgPanel">
                <span class="errorNotification"></span>
            </div>

            <form id="settingsForm" action="Default.aspx" method="post" data-ajax="false">
                <div id="LoggedOut">
                    <div class="bottomPadding15">
                        <asp:Label ID="lblUserName" runat="server" Text="User name"></asp:Label>
                        <input id="txtUserName" type="text" autocorrect="off" autocapitalize="none" data-mini="true" />
                    </div>

                    <div class="bottomPadding15">
                        <asp:Label ID="lblPassword" runat="server" Text="Password"></asp:Label>
                        <input id="txtPassword" type="password" data-mini="true" />
                    </div>
                </div>

                <div id="LoggedIn" class="hideMe smallText">
                    <table class="statsTable">
                        <tr>
                            <td class="labelColumn">
                                <asp:Label ID="lblCurUserL" runat="server" Text="Current user:"></asp:Label>
                            </td>
                            <td class="fieldColumn">
                                <asp:Label ID="lblCurUser" runat="server" Text=""></asp:Label>
                            </td>
                        </tr>

                        <tr>
                            <td class="labelColumn">
                                <asp:Label ID="lblBookmarkCountL" runat="server" Text="Bookmarks:"></asp:Label>
                            </td>
                            <td class="fieldColumn">
                                <asp:Label ID="lblBookmarkCount" runat="server" Text=""></asp:Label>
                            </td>
                        </tr>

                        <tr>
                            <td class="labelColumn">
                                <asp:Label ID="lblLastRefreshL" runat="server" Text="Last refresh:"></asp:Label>
                            </td>
                            <td class="fieldColumn">
                                <asp:Label ID="lblLastRefresh" runat="server" Text=""></asp:Label>
                            </td>
                        </tr>
                    </table>
                </div>

                <div id="CommonSettings" class="alignCenter">
                    <div class="bottomPadding15">
                        <input id="chkLoadOnStartup" data-mini="true" type="checkbox" name="LoadOnStartup" />
                        <label for="chkLoadOnStartup">Refresh bookmark data on startup</label>
                    </div>
                    <div class="bottomPadding15">
                        <input id="chkLastDirOnStartup" data-mini="true" type="checkbox" name="LastDirOnStartup" />
                        <label for="chkLastDirOnStartup">Go to last known directory at startup</label>
                    </div>
                </div>

                <div id="LoggedInButtons" class="alignCenter hideMe">
                    <input id="Logout" type="button" value="Logout" data-mini="true" onclick="return Logout_OnClick();" />
                    <br />
                    <input id="Refresh" type="button" value="Refresh" data-mini="true" onclick="return Refresh_OnClick();" />
                    <br />
                </div>

                <div id="CommonButtons" class="alignCenter">
                    <input id="Save" type="submit" value="Save" data-mini="true" onclick="return Save_OnClick();" />
                </div>
            </form>
        </div>

        <div data-role="footer">
            <div data-role="navbar">
                <ul class="footerList">
                    <li>
                        <a href="#Home" data-role="button" data-icon="home">Home</a>
                    </li>
                    <li>
                        <a href="#Bookmarks" data-role="button" data-icon="star">Bookmarks</a>
                    </li>
                    <li>
                        <a href="#Settings" data-role="button" data-icon="gear">Settings</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <script type="text/javascript" src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script type="text/javascript" src="http://code.jquery.com/mobile/1.4.1/jquery.mobile-1.4.1.min.js"></script>
    <script type="text/javascript" src="Scripts/lib/modernizr.custom.2.7.1-min.js"></script>
    <script type='text/javascript' src="http://cdnjs.cloudflare.com/ajax/libs/knockout/3.0.0/knockout-min.js"></script>
    <script type='text/javascript' src='Scripts/lib/moment.min.js'></script>
    <script type='text/javascript' src='Scripts/lib/common.js'></script>
    <script type="text/javascript" src="Scripts/view-models/bookmarks-view-model.js"></script>
    <script type="text/javascript" src="Scripts/bmb/bookmark-browser-common.js"></script>
    <script type="text/javascript" src="Scripts/bmb/bookmark-browser-default.js"></script>
<%--    <script type="text/javascript" src="Scripts/bmb/bookmark-browser-selectdir.js"></script>--%>

    <script type="text/javascript">
        $(document).ready(function () {
            if (Modernizr.localstorage) {
                $("#Bookmarks").on("pagebeforeshow", Bookmarks_PageBeforeShow);
                $("#Bookmarks").on("pagechangefailed", Bookmarks_PageChangeFailed);
                $("#Settings").on("pagebeforeshow", Settings_PageBeforeShow);
                $("#Settings").on("pagechangefailed", Settings_PageChangeFailed);
                //$("#SelectDir").on("pagebeforeshow", SelectDir_PageBeforeShow);
                $(document).ajaxComplete(ajaxCompleted);

                $("#backButton").attr("data-nodepath", "Root");
                var url = $.mobile.path.parseUrl(window.location);
                var loadOnStartup = localStorage.getItem("LoadOnStartup");
                var lastDirOnStartup = localStorage.getItem("LastDirOnStartup");
                var hasLoaded = sessionStorage.getItem("HasLoaded");

                switch (url.hash) {
                    case "#Bookmarks":
                        if (!localStorage.getItem("CurrentBookmarks")) {
                            displayMessage("Go to the Settings page to enter your Sync credentials.", "Bookmarks");
                            $("#bookmarkContainer").hide();
                            return;
                        }

                        $(document).attr("title", "Bookmarks");
                        break;
                    case "#Settings":
                        $(document).attr("title", "Settings");
                        break;
                    default:
                        // If this is the initial visit to the site and the 'Load On Startup' option 
                        // is set, fetch the latest bookmark data
                        if (loadOnStartup === "True" && hasLoaded != "True" && localStorage.getItem("UserName")) {
                            $.mobile.loading("show", { theme: "c", text: "Loading ...", textVisible: true });

                            var userName = localStorage.getItem("UserName");
                            var password = localStorage.getItem("Password");
                            loadBookmarks(userName, password, "Init");
                        }

                        break;
                }
            }
            else {
                displayMessage("Your browser doesn't support certain features required for this site.", "Home");
                $("#homePageContent").hide();
                $("#homePageFooter").hide();
                $("#Bookmarks").hide();
                $("#Settings").hide();

                return;
            }

            // Setting this flag to True prevents the refresh from happening later in the user's session
            sessionStorage.setItem("HasLoaded", "True");

            $.ajaxSetup({
                // Disable caching of AJAX responses
                cache: false
            });
        });
    </script>
</body>
</html>
