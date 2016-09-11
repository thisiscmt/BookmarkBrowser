function login(userName, password) {


}

function verifyLogin(verificationLink) {
    return $.ajax({
        type: "POST",
        url: "api/verify",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ verificationLink: verificationLink }),
        headers: {"cache-control":"no-cache"}
        //success: function (data) {
        //},
        //error: function (error) {
        //    displayMessage(getErrorMessage(error), "Settings");
        //}
    });
}

function loadBookmarks(userName, password, action) {
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

                if ($("#loadOnStartup").prop("checked")) {
                    loadOnStartup = "True";
                }
                if ($("#lastDirOnStartup").prop("checked")) {
                    lastDirOnStartup = "True";
                }

                localStorage.setItem("LoadOnStartup", loadOnStartup);
                localStorage.setItem("LastDirOnStartup", lastDirOnStartup);
            }
        },
        error: function (error) {
            displayMessage(getErrorMessage(error), "Settings");
        }
    });
}

function ajaxCompleted(e, xhr, settings) {
    var action;

    if (settings.url.indexOf("api/bookmark") > -1) {
        if (xhr.status < 400 && (settings.url.indexOf("/backup") === -1 || (settings.url.indexOf("/backup") > -1 && settings.type === "GET"))) {
            $("body").pagecontainer("change", "#Bookmarks", { reload: true });
        }

        $.mobile.loading("hide");
    }
    else if (settings.url.indexOf("api/verify") > -1) {
        $.mobile.loading("hide");
    }
}
