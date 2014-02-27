// Select Directory
function Save_OnClick() {
    return false;

    var userName = localStorage.getItem("UserName");
    var password = localStorage.getItem("Password");
    var syncKey = localStorage.getItem("SyncKey");
    var urlParms = BMB.Common.getUrlParms();

    if (!userName || !password || !syncKey) {
        displayMessage("Missing user credentials, make sure you have logged into the application", "SelectDir");
        return false;
    }

    // TODO: Replace with whatever directory the user selected in the UI
    dir = "Bookmarks Menu";

    $.ajax({
        type: "POST",
        url: "SelectDir.aspx/SaveBookmark",
        contentType: "application/json; charset=utf-8",
        data: "{'userName':'" + userName.toLowerCase() + "', 'password':'" + password + "', 'syncKey':'" + syncKey + "', 'url':'" + urlParms.u + "', 'title':'" + urlParms.t + "', 'dir':'" + dir + "'}",
        dataType: "json",
        error: function (error) {
            var resp = JSON.parse(error.responseText);
            displayMessage(resp.Message, "SelectDir");
        },
        success: function (data) {
            sessionStorage.removeItem("URLToBeSaved");

            // TODO: Close this window, try to switch to the the previous one?
        }
    });

    return false;
}
