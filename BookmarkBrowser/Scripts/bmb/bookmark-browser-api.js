var bmbAPI = (function (bmbCommon) {
    function login(userName, password) {
        var data = { Username: userName, Password: password };

        return $.ajax({
            type: "POST",
            url: "api/login",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            headers: { "cache-control": "no-cache" },
            success: function (data) {
                localStorage.setItem("UserName", userName);
                localStorage.setItem("Password", password);
                $("#userName").val("");
                $("#password").val("");

                var loginResponse = JSON.parse(data.Content);
                localStorage.setItem("UID", loginResponse.Uid);
                localStorage.setItem("KeyFetchToken", loginResponse.KeyFetchToken);
                localStorage.setItem("SessionToken", loginResponse.SessionToken);

                $("#verificationLinkInput").show();
                $("#Verify").show();
            },
            error: function (error) {
                bmbCommon.displayMessage(bmbCommon.getErrorMessage(error), "Auth");
            }
        });
    }

    function verifyLogin(verificationLink) {
        var data = { UID: localStorage.getItem("UID"), VerificationLink: verificationLink };

        return $.ajax({
            type: "POST",
            url: "api/verify",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            headers: { "cache-control": "no-cache" },
            success: function (data) {
                $("#verificationLinkInput").hide();
                $("#Verify").hide();
                $("#Backup").show();
                localStorage.removeItem("UID");
            },
            error: function (error) {
                bmbCommon.displayMessage(bmbCommon.getErrorMessage(error), "Auth");
            }
        });
    }

    function loadBookmarks(userName, password, action) {
        var keyFetchToken = localStorage.getItem("KeyFetchToken");
        var sessionToken = localStorage.getItem("SessionToken");
        var url = "api/bookmark?username=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(password);
        url += "&keyFetchToken=" + keyFetchToken + "&sessionToken=" + sessionToken;

        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: { "cache-control": "no-cache" },
            success: function (data) {
                var mainDir = JSON.parse(data.Content);

                localStorage.setItem("CurrentBookmarks", data.Content);
                localStorage.setItem("BookmarkCount", mainDir.Tag);
                localStorage.setItem("LastRefresh", new Date().toISOString());
            },
            error: function (error) {
                bmbCommon.displayMessage(bmbCommon.getErrorMessage(error), "Auth");
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
        else if (settings.url.indexOf("api/login") > -1) {  // || settings.url.indexOf("api/verify") > -1) {
            $.mobile.loading("hide");
        }
    }

    return {
        login: login,
        verifyLogin: verifyLogin,
        loadBookmarks: loadBookmarks,
        ajaxCompleted: ajaxCompleted
    };
})(bmbCommon);

