function getErrorMessage(error) {
    var msg = "";

    if (error) {
        if (error.responseText && error.responseText != "") {
            try {
                var response = JSON.parse(error.responseText);

                if (response.Message) {
                    msg = response.Message;
                }
                else {
                    if (response.ExceptionMessage && response.ExceptionMessage != "") {
                        msg = response.ExceptionMessage;
                    }
                    else {
                        msg = response;
                    }
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
