export const getHeaderText = (currentPage, currentDirectory) => {
    let headerText = '';

    if (currentPage === 'Bookmarks') {
        if (currentDirectory) {
            if (currentDirectory === 'Root') {
                headerText = 'Bookmarks';
            }
            else {
                headerText = getDirectoryFromPath(currentDirectory);
            }
        }
        else {
            headerText = 'Bookmarks';
        }
    }
    else if (currentPage === 'Home' || currentPage === "Preferences" || currentPage === 'Config') {
        headerText = currentPage;

    } else {
        headerText = "Error"
    }

    return headerText;
}

export const getDirectoryFromPath = (path) => {
    const index = path.lastIndexOf('\\');

    if (index > -1) {
        return path.substring(index + 1);
    }
    else {
        return path;
    }
};

export const isMobile = () => {
    const mobileCheck = {
        Android: function () {
            return !!navigator.userAgent.match(/Android/i);
        },
        iOS: function () {
            return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
        }
    }

    return mobileCheck.Android() || mobileCheck.iOS();
};

export const getErrorMessage = (error) => {
    let msg = '';

    if (error) {
        if (error.response && typeof error.response.data && typeof error.response.data === 'string') {
            msg = error.response.data;
        } else if (error.response && error.response.statusText) {
            msg = error.response.statusText;
        } else {
            if (error.message) {
                msg = error.message;
            }
            else if (typeof error === 'string') {
                msg = error;
            }
            else {
                msg = 'An unexpected error occurred';
            }
        }
    }

    return msg;
};
