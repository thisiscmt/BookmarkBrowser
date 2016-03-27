// Misc
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
        if (xhr.status < 400) {
            $("body").pagecontainer("change", "#Bookmarks", { reload: true });
        }

        $.mobile.loading("hide");
    }
}

function getErrorMessage(error) {
    var msg = "";

    if (error) {
        if (error.responseText && error.responseText != "") {
            try {
                var response = JSON.parse(error.responseText);

                if (response.Message) {
                    if (response.ExceptionMessage != "") {
                        msg = response.ExceptionMessage;
                    }
                    else {
                        msg = response.Message;
                    }
                }
                else {
                    msg = response;
                }
            }
            catch (e) {
                msg = error.responseText;
            }
        }
        else if (error.statusText && error.statusText != "") {
            msg = error.statusText;
        }
        else {
            if (error.message) {
                msg = error.message;
            }
            else {
                msg = error;
            }
        }
    }

    return msg;
}

function displayMessage(msg, page) {
    $("#" + page).find(".errorNotification").html(msg);
    $("#" + page).find(".msgPanel").css("display", "block");
}

function clearMessagePanel(page) {
    $("#" + page).find(".errorNotification").html("");
    $("#" + page).find(".msgPanel").css("display", "none");
}
