<%@ Language="C#" AutoEventWireup="true" CodeBehind="Error.aspx.cs" Inherits="BookmarkBrowser._Error" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">

<head runat="server">
    <title></title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="../Styles/Site.css"/>
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.1.1/jquery.mobile-1.1.1.min.css" />
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="http://code.jquery.com/mobile/1.1.1/jquery.mobile-1.1.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/bookmark-browser-common.js"></script>
    <script type="text/javascript" src="../Scripts/common.js"></script>

    <script type="text/javascript">
    </script>

    <style type="text/css">
    </style>
</head>
<body>
    <div>
        <div id="Error" data-role="page">
            <div data-role="header" data-theme="b">
                <h5>Error</h5>
            </div>

            <div data-role="content" data-theme="b">
                <div class="errorNotification alignCenter">
                    <asp:Literal ID="litMsg" runat="server"></asp:Literal>
                </div>
            </div>

            <div data-role="footer" data-theme="b">
                <div data-role="navbar">
                    <ul>
                        <li>
                            <a href="../Default.aspx#Home" data-role="button" data-iconpos="bottom" data-icon="home">Home</a>
                        </li>
                        <li>
                            <a href="../Default.aspx#Bookmarks" data-role="button" data-iconpos="bottom" data-icon="star">Bookmarks</a>
                        </li>
                        <li>
                            <a href="../Default.aspx#Settings" data-role="button" data-iconpos="bottom" data-icon="gear">Settings</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</body>
</html>



