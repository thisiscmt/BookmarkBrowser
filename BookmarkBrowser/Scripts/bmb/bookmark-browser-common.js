// Misc
function loadBookmarks(userName, password, action) {
    // The 'cache-control' header is needed to deal with a caching bug in Safari on iOS 6.
    // See http://stackoverflow.com/questions/12506897/is-safari-on-ios-6-caching-ajax-results
    $.ajax({
        type: "GET",
        url: "api/bookmark?username=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(password),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {"cache-control":"no-cache"},
        success: function (data) {
            var mainDir = JSON.parse(data.Content);

            localStorage.setItem("CurrentBookmarks", data.Content);
            localStorage.setItem("BookmarkCount", mainDir.Tag);
            localStorage.setItem("LastRefresh", new Date().toISOString());
            var loadOnStartup = "False";
            var lastDirOnStartup = "False";

            if (action === "Login" || action == "Save") {
                localStorage.setItem("UserName", userName);
                localStorage.setItem("Password", password);

                if ($("#chkLoadOnStartup").prop("checked")) {
                    loadOnStartup = "True";
                }
                if ($("#chkLastDirOnStartup").prop("checked")) {
                    lastDirOnStartup = "True";
                }

                localStorage.setItem("LoadOnStartup", loadOnStartup);
                localStorage.setItem("LastDirOnStartup", lastDirOnStartup);
            }
        },
        error: function (error) {
            var msg;

            if (error.statusText) {
                msg = error.statusText;
            }
            else {
                try {
                    var resp = JSON.parse(error.responseText);
                    msg = resp.Message;
                }
                catch (e) {
                    msg = "Server error occurred";
                }
            }

            displayMessage(msg, "Settings");
        }
    });
}

function ajaxCompleted(e, xhr, settings) {
    var action;

    if (settings.url.indexOf("api/bookmark") > -1) {
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
