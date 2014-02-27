<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SelectDir.aspx.cs" Inherits="BookmarkBrowser._SelectDir" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head runat="server">
    <title></title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="Styles/Site.css"/>
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.css" />
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.js"></script>
    <script type="text/javascript" src="Scripts/modernizr.min.js"></script>
    <script type='text/javascript' src='Scripts/knockout-2.1.0.js'></script>
    <script type="text/javascript" src="Scripts/bookmark-browser-selectdir.js"></script>
    <script type="text/javascript" src="Scripts/bookmark-browser-common.js"></script>
    <script type="text/javascript" src="Scripts/common.js"></script>

    <script type="text/javascript">
        $(document).ready(function () {
            if (Modernizr.localstorage) {
            }
            else {
                displayMessage("Your browser doesn't support certain features required for this site.", "SelectDir");
                $("#selectPageContent").hide();

                return;
            }

            $.ajaxSetup({
                // Disable caching of AJAX responses
                cache: false
            });
        });
    </script>
</head>

<body>
    <div id="SelectDir" data-role="page" data-theme="b" data-title="Select Directory">
        <div data-role="header" data-theme="b">
            <h5>Select</h5>
        </div>

        <div data-role="content" data-theme="b">
            <div class="msgPanel">
                <span class="errorNotification"></span>
            </div>

            <div id="selectPageContent">
                <form id="selectDirForm" action="SelectDir.aspx" method="post" data-ajax="false">
                    <div>
                        Select directory here
                    </div>

                    <a href="#" data-role="button" data-mini="true" onclick="return Save_OnClick();">Save</a>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
