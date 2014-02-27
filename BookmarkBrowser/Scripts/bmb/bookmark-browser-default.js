// Bookmarks
function Bookmarks_PageBeforeShow(event, ui) {
    if (!localStorage.getItem("CurrentBookmarks")) {
        displayMessage("Go to the Settings page to enter your Sync credentials.", "Bookmarks");
        $("#bookmarkContainer").hide();
        return;
    }

    clearMessagePanel("Bookmarks");

    if (!ko.dataFor($("#bookmarkContainer")[0])) {
        applyBindings();

        // We need to show the bookmark container in case the app was started in a logged-out state
        // and the user just logged in, otherwise it will stay in its default hidden state until a 
        // full page refresh.
        $("#bookmarkContainer").show();
    }

    // For some reason an explicit refresh of the bookmark list is required when transitioning to 
    // a new directory, otherwise the JQM styles won't be applied. This step wasn't necessary with 
    // JQM 1.2 and Knockout 2.1, so maybe there is something weird going on in the newer version of 
    // one or both of those.
    $("#bmMain").listview("refresh");
}

function Bookmarks_PageChangeFailed(event, ui) {
    // TODO
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
    clearMessagePanel("Settings");
    loadSettingsPage();
}

function Settings_PageChangeFailed(event, ui) {
    // TODO
}

function loadSettingsPage() {
    var userName = localStorage.getItem("UserName");
    var loadOnStartup = false;
    var lastDirOnStartup = false;

    if (userName) {
        $("#lblCurUser").html(userName);
        $("#lblBookmarkCount").html(localStorage.getItem("BookmarkCount"));
        $("#lblLastRefresh").html(localStorage.getItem("LastRefresh"));

        if (localStorage.getItem("LoadOnStartup") === "True") {
            loadOnStartup = true;
        }
        if (localStorage.getItem("LastDirOnStartup") === "True") {
            lastDirOnStartup = true;
        }

        $("#chkLoadOnStartup").prop("checked", loadOnStartup).checkboxradio("refresh");
        $("#chkLastDirOnStartup").prop("checked", lastDirOnStartup).checkboxradio("refresh");
        $("#LoggedOut").hide();
        $("#LoggedIn").show();
        $("#LoggedInButtons").show();
    }
    else {
        $("#txtUserName").val("");
        $("#txtPassword").val("");
        $("#txtSyncKey").val("");
        $("#chkLoadOnStartup").prop("checked", false).checkboxradio("refresh");
        $("#chkLastDirOnStartup").prop("checked", false).checkboxradio("refresh");
    }
}

function Save_OnClick() {
    var userName;
    var password;
    var syncKey;
    var loadOnStartup = "False";
    var lastDirOnStartup = "False";

    // If bookmark data exists we are merely saving options, otherwise the user is doing an initial login
    if (localStorage.getItem("CurrentBookmarks")) {
        var saveTimer = setTimeout(function () {
            $.mobile.loading("hide");
            clearTimeout(saveTimer);
        }, 1000);

        $.mobile.loading("show", { theme: "c", text: "Saving ...", textVisible: true, textonly: true });

        if ($("#chkLoadOnStartup").prop("checked")) {
            loadOnStartup = "True";
        }
        if ($("#chkLastDirOnStartup").prop("checked")) {
            lastDirOnStartup = "True";
        }

        localStorage.setItem("LoadOnStartup", loadOnStartup);
        localStorage.setItem("LastDirOnStartup", lastDirOnStartup);
    }
    else {
        userName = $("#txtUserName").val();
        password = $("#txtPassword").val();
        syncKey = $("#txtSyncKey").val();

        if (!userName) {
            displayMessage("User name cannot be blank", "Settings");
            return false;
        }
        if (!password) {
            displayMessage("Password cannot be blank", "Settings");
            return false;
        }
        if (!syncKey) {
            displayMessage("Sync key cannot be blank", "Settings");
            return false;
        }

        clearMessagePanel("Settings");
        $.mobile.loading("show", { theme: "c", text: "Loading ...", textVisible: true });
        loadBookmarks(userName, password, syncKey, "Login");
    }

    return false;
}

function Logout_OnClick() {
    $.mobile.loading("show", { theme: "c" });

    localStorage.removeItem("UserName");
    localStorage.removeItem("Password");
    localStorage.removeItem("SyncKey");
    localStorage.removeItem("CurrentBookmarks");
    localStorage.removeItem("BookmarkCount");
    localStorage.removeItem("LastRefresh");
    localStorage.removeItem("CurrentNode");
    sessionStorage.removeItem("CurrentNode")

    $("#txtUserName").val("")
    $("#txtPassword").val("")
    $("#txtSyncKey").val("")
    $("#LoggedIn").hide();
    $("#LoggedInButtons").hide();
    $("#LoggedOut").show();

    ko.dataFor($("#bookmarkContainer")[0]).removeBookmarks();

    $.mobile.loading("hide");
    $("body").pagecontainer("change", "#Settings", { allowSamePageTransition: true });

    return false;
}

function Refresh_OnClick() {
    $.mobile.loading("show", { theme: "c", text: "Loading ...", textVisible: true });

    var userName = localStorage.getItem("UserName");
    var password = localStorage.getItem("Password");
    var syncKey = localStorage.getItem("SyncKey");
    loadBookmarks(userName, password, syncKey, "Refresh");

    return false;
}
