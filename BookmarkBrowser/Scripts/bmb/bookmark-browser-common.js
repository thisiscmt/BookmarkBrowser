// Misc
function loadBookmarks(userName, password, syncKey, action) {
    // The 'cache-control' header is needed to deal with a caching bug in Safari on iOS 6.
    // See http://stackoverflow.com/questions/12506897/is-safari-on-ios-6-caching-ajax-results
    $.ajax({
        type: "POST",
        url: "Default.aspx/LoadBookmarks",
        contentType: "application/json; charset=utf-8",
        data: "{'userName':'" + userName + "', 'password':'" + password + "', 'syncKey':'" + syncKey + "'}",
        dataType: "json",
        headers: {"cache-control":"no-cache", "LoadAction":action},
        error: function (error) {
            var resp = JSON.parse(error.responseText);
            displayMessage(resp.Message, "Settings");
        },
        success: function (data) {
            localStorage.setItem("CurrentBookmarks", JSON.stringify(data.d));
            localStorage.setItem("BookmarkCount", data.d.Tag);
            localStorage.setItem("LastRefresh", Date.now().toString("M/d/yyyy h:mm tt"));
            var loadOnStartup = "False";
            var lastDirOnStartup = "False";

            if (action === "Login" || action == "Save") {
                localStorage.setItem("UserName", userName);
                localStorage.setItem("Password", password);
                localStorage.setItem("SyncKey", syncKey);

                if ($("#chkLoadOnStartup").prop("checked")) {
                    loadOnStartup = "True";
                }
                if ($("#chkLastDirOnStartup").prop("checked")) {
                    lastDirOnStartup = "True";
                }

                localStorage.setItem("LoadOnStartup", loadOnStartup);
                localStorage.setItem("LastDirOnStartup", lastDirOnStartup);
            }
        }
    });
}

function ajaxCompleted(e, xhr, settings) {
    var action;

    if (settings.url === "Default.aspx/LoadBookmarks") {
        if (xhr.status < 400) {
            $("body").pagecontainer("change", "#Bookmarks", { reload: true });
        }

        $.mobile.loading("hide");
    }
}

function displayMessage(msg, page) {
    $("#" + page).find(".errorNotification").html(msg);
    $("#" + page).find(".msgPanel").css("display", "block");
}

function clearMessagePanel(page) {
    $("#" + page).find(".errorNotification").html("");
    $("#" + page).find(".msgPanel").css("display", "none");
}
