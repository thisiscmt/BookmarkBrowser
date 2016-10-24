// Bookmarks
function Bookmarks_PageBeforeShow(event, ui) {
    if (!localStorage.getItem("CurrentBookmarks")) {
        bmbCommon.displayMessage("Go to the Authentication page to enter your Sync credentials", "Bookmarks");
        $("#bookmarkContainer").hide();
        return;
    }

    bmbCommon.clearMessagePanel("Bookmarks");

    if (!ko.dataFor($("#bookmarkContainer")[0])) {
        applyBindings();

        // We need to show the bookmark container in case the app was started in a logged-out state
        // and the user just logged in, otherwise it will stay in its default hidden state until a 
        // full page refresh.
        $("#bookmarkContainer").show();
    }

    // For some reason an explicit refresh of the bookmark list is required when transitioning to 
    // a new directory, otherwise the jQuery Mobile styles won't be applied. This step wasn't necessary 
    // with JQM 1.2 and Knockout 2.1, so something obviously changed in the newer version of one or both 
    // of those.
    $("#bmMain").listview("refresh");
}

function Bookmarks_PageChangeFailed(event, ui) {
}

function doNavigation(sender) {
    var nodePath;
    var newHeader;
    var newPath;

    if (sender.id === "backButton") {
        nodePath = $(sender).attr("data-nodepath").split("\\");
        nodePath.pop();

        if (nodePath.length === 0) {
            return;
        }

        if (nodePath.length === 2) {
            newPath = "Root";
            newHeader = "Bookmarks";
        }
        else {
            newPath = nodePath.join("\\");
            nodePath.shift();
            newHeader = nodePath[nodePath.length - 1];
        }

        $("#backButton").attr("data-nodepath", newPath);
    }
    else if (sender.id === "topButton") {
        if ($("#backButton").attr("data-nodepath") === "Root") {
            return;
        }

        newHeader = "Bookmarks";
        $("#backButton").attr("data-nodepath", "Root");
    }
    else {
        nodePath = $(sender).attr("data-nodepath").split("\\");
        nodePath.shift();
        newHeader = nodePath[nodePath.length - 1];
        $("#backButton").attr("data-nodepath", $(sender).attr("data-nodepath"));
    }

    var currentBookmarks = JSON.parse(localStorage.getItem("CurrentBookmarks"));
    var curNode = getNode(currentBookmarks.BookmarkItems, nodePath);
    ko.dataFor($("#bookmarkContainer")[0]).setBookmarks(curNode);
    $("#bmHeader").html(newHeader);
    $("body").pagecontainer("change", "#Bookmarks", { transition: "fade", allowSamePageTransition: true });
}

function getNode(items, nodePath) {
    var curDir;
    var node = null;

    if (nodePath) {
        curDir = nodePath.shift();

        for (var i = 0; i < items.length; i++) {
            if (items[i].Name === curDir && items[i].ItemType === 0) {
                // We know to stop when we've found the final directory in the node's path
                if (nodePath.length === 0) {
                    node = items[i];
                    break;
                }
                else {
                    node = getNode(items[i].BookmarkItems, nodePath);
                    break;
                }
            }
        }
    }

    return node;
}

// Settings
function Settings_PageBeforeShow(event, ui) {
    bmbCommon.clearMessagePanel("Settings");
    loadSettingsPage();
}

function Settings_PageChangeFailed(event, ui) {
}

function loadSettingsPage() {
    var loadOnStartup = false;
    var lastDirOnStartup = false;

    if (localStorage.getItem("LoadOnStartup") === "True") {
        loadOnStartup = true;
    }

    if (localStorage.getItem("LastDirOnStartup") === "True") {
        lastDirOnStartup = true;
    }

    $("#loadOnStartup").prop("checked", loadOnStartup).checkboxradio("refresh");
    $("#lastDirOnStartup").prop("checked", lastDirOnStartup).checkboxradio("refresh");
}

function Save_OnClick() {
    var loadOnStartup = "False";
    var lastDirOnStartup = "False";

    var saveTimer = setTimeout(function () {
        $.mobile.loading("hide");
        clearTimeout(saveTimer);
    }, 1000);

    $.mobile.loading("show", { theme: "c", text: "Saving ...", textVisible: true, textonly: true });

    if ($("#loadOnStartup").prop("checked")) {
        loadOnStartup = "True";
    }

    if ($("#lastDirOnStartup").prop("checked")) {
        lastDirOnStartup = "True";
    }

    localStorage.setItem("LoadOnStartup", loadOnStartup);
    localStorage.setItem("LastDirOnStartup", lastDirOnStartup);

    return false;
}

// Auth
function Auth_PageBeforeShow(event, ui) {
    bmbCommon.clearMessagePanel("Auth");
    loadAuthPage();
}

function loadAuthPage() {
    var userName = localStorage.getItem("UserName");

    if (userName) {
        $("#currentUser").html(userName);
        $("#bookmarkCount").html(localStorage.getItem("BookmarkCount"));
        $("#lastRefresh").html(moment(localStorage.getItem("LastRefresh")).format("LLL"));
        $("#LoggedOutContainer").hide();
        $("#LoggedInContainer").show();
        $(".loggedIn").show();
    }
    else {
        $("#userName").val("");
        $("#password").val("");
    }
}

function Login_OnClick() {
    var userName = $("#userName").val();
    var password = $("#password").val();

    if (!userName) {
        bmbCommon.displayMessage("Username cannot be blank", "Auth");
        return false;
    }
    if (!password) {
        bmbCommon.displayMessage("Password cannot be blank", "Auth");
        return false;
    }

    $.mobile.loading("show", { theme: "c", text: "Authenticating ...", textVisible: true });

    bmbAPI.login(userName, password);

    return false;
}

function Logout_OnClick() {
    $.mobile.loading("show", { theme: "c" });

    localStorage.removeItem("UserName");
    localStorage.removeItem("Password");
    localStorage.removeItem("CurrentBookmarks");
    localStorage.removeItem("BookmarkCount");
    localStorage.removeItem("LastRefresh");
    localStorage.removeItem("CurrentNode");
    sessionStorage.removeItem("CurrentNode")

    $("#userName").val("")
    $("#password").val("")
    $("#LoggedInContainer").hide();
    $("#LoggedOutContainer").show();
    $("#Login").show();
    $("#Backup").hide();

    var bindingModel = ko.dataFor($("#bookmarkContainer")[0]);

    if (bindingModel) {
        bindingModel.removeBookmarks();
    }

    $.mobile.loading("hide");
    $("body").pagecontainer("change", "#Auth", { allowSamePageTransition: true });

    return false;
}

function VerifyLogin_OnClick() {

    var userName = localStorage.getItem("UserName");
    var password = localStorage.getItem("Password");
    var keyFetchToken = localStorage.getItem("KeyFetchToken");
    var sessionToken = localStorage.getItem("SessionToken");
    var verificationLink = $("#verificationLink").val();

    if (!verificationLink) {
        bmbCommon.displayMessage("Verification link cannot be blank", "Auth");
        return false;
    }

    $.mobile.loading("show", { theme: "c", text: "Loading ...", textVisible: true });

    bmbAPI.verifyLogin(verificationLink).then(function (data, status, jqXHR) {
        bmbAPI.loadBookmarks(userName, password, "Refresh");
    }, function (data, status, jqXHR) {
        bmbCommon.displayMessage(bmbCommon.etErrorMessage(data), "Auth");
    });

    return false;
}

//function Refresh_OnClick() {
//    $.mobile.loading("show", { theme: "c", text: "Loading ...", textVisible: true });

//    var userName = localStorage.getItem("UserName");
//    var password = localStorage.getItem("Password");
//    var keyFetchToken = localStorage.getItem("KeyFetchToken");
//    var sessionToken = localStorage.getItem("SessionToken");
//    var verificationLink = $("#verificationLink").val();

//    if (verificationLink && verificationLink !== "") {
//        bmbAPI.verifyLogin(verificationLink).then(function (data, status, jqXHR) {
//            bmbAPI.loadBookmarks(userName, password, "Refresh");
//        }, function(data, status, jqXHR) {
//            bmbCommon.displayMessage(bmbCommon.etErrorMessage(data), "Auth");
//        });
//    }
//    else {
//        bmbAPI.loadBookmarks(userName, password, "Refresh");
//    }

//    return false;
//}

function Backup_OnClick() {
    $.mobile.loading("show", { theme: "c", text: "Backing up data ...", textVisible: true });
    var userName = localStorage.getItem("UserName");
    var password = localStorage.getItem("Password");
    var bookmarkData = localStorage.getItem("CurrentBookmarks");

    if (bookmarkData) {
        var data = {};
        data.bookmarkData = bookmarkData;
        data.count = localStorage.getItem("BookmarkCount");
        data.lastRefresh = localStorage.getItem("LastRefresh");

        $.ajax({
            type: "POST",
            url: "api/bookmark/backup?username=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(password),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            headers: {"cache-control":"no-cache"},
            success: function (data) {
                bmbCommon.displayMessage("Data backed up successfully", "Auth");
            },
            error: function (error) {
                bmbCommon.displayMessage(bmbCommon.getErrorMessage(error), "Auth");
            }
        });
    }

    return false;
}

function Restore_OnClick() {
    var userName = localStorage.getItem("UserName");
    var password = localStorage.getItem("Password");

    if (!userName || !password) {
        userName = $("#userName").val();
        password = $("#password").val();

        if (!userName) {
            bmbCommon.displayMessage("User name cannot be blank", "Auth");
            return false;
        }
        if (!password) {
            bmbCommon.displayMessage("Password cannot be blank", "Auth");
            return false;
        }
    }

    $.mobile.loading("show", { theme: "c", text: "Restoring data ...", textVisible: true });

    $.ajax({
        type: "GET",
        url: "api/bookmark/backup?username=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(password),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {"cache-control":"no-cache"},
        success: function (response) {
            var data = JSON.parse(response.Content);
            localStorage.setItem("CurrentBookmarks", data.bookmarkData);
            localStorage.setItem("BookmarkCount", data.count);
            localStorage.setItem("LastRefresh", data.lastRefresh);

            localStorage.setItem("UserName", userName);
            localStorage.setItem("Password", password);
        },
        error: function (error) {
            bmbCommon.displayMessage(bmbCommon.getErrorMessage(error), "Auth");
        }
    });

    return false;
}
