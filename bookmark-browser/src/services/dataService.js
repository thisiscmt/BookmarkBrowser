import {TypeCodes} from '../enums/TypeCodes';
import {STORAGE_BOOKMARK_DATA, STORAGE_CURRENT_DIRECTORY, STORAGE_CURRENT_NODE, STORAGE_PREFS_GO_TO_LAST_DIRECTORY} from '../constants/constants';

export const setApplicationData = (key, value) => {
    localStorage.setItem(key, value);
};

export const getApplicationData = (key) => {
    return localStorage.getItem(key);
};

export const removeApplicationData = (key) => {
    localStorage.removeItem(key);
};

export const setSessionData = (key, value) => {
    sessionStorage.setItem(key, value);
};

export const getSessionData = (key) => {
    return sessionStorage.getItem(key);
};

export const removeSessionData = (key) => {
    sessionStorage.removeItem(key);
};

export const getNode = (items, path) => {
    let directory;
    let bookmark = null;

    if (path) {
        // If the first directory in the path is 'Root', take it out since it doesn't represent a real bookmark and would cause the search
        // to fail
        if (path[0] === 'Root') {
            path.shift();
        }

        directory = path.shift();

        for (let i = 0; i < items.length; i++) {
            if (items[i].title === directory && items[i].typeCode === TypeCodes.Directory) {
                // We know to stop when we've found the final directory in the node's path
                if (path.length === 0) {
                    bookmark = items[i];
                    break;
                }
                else {
                    bookmark = getNode(items[i].children, path);
                    break;
                }
            }
        }
    }

    return bookmark;
};

export const getCurrentBookmarks = (currentNavigation) => {
    const bookmarkData = JSON.parse(getApplicationData(STORAGE_BOOKMARK_DATA));
    const showLastDir = getApplicationData(STORAGE_PREFS_GO_TO_LAST_DIRECTORY);
    const currentDirectory = getSessionData(STORAGE_CURRENT_DIRECTORY);

    let currentBookmarks = {
        bookmarkToolbar: [],
        bookmarkMenu: [],
        topLevel: true
    };

    let node = null;
    let directory = '';

    if (bookmarkData) {
        if (currentNavigation.action === 'GoToPriorLevel' && currentNavigation.node) {
            let path = currentNavigation.node.path.split("\\");

            if (path.length <= 3) {
                currentBookmarks.bookmarkToolbar = bookmarkData.children[0].children;
                currentBookmarks.bookmarkMenu = bookmarkData.children[1].children;
            } else {
                path.splice(path.length - 1, 1);
                path.splice(0, 1);
                node = getNode(bookmarkData.children, path);
                directory = node.path;

                currentBookmarks.bookmarkToolbar = node.children;
                currentBookmarks.topLevel = false;
            }
        } else if (currentNavigation.action === 'GoToTop') {
            currentBookmarks.bookmarkToolbar = bookmarkData.children[0].children;
            currentBookmarks.bookmarkMenu = bookmarkData.children[1].children;
        } else if (currentNavigation.action === 'GoToDirectory' && currentNavigation.node) {
            currentBookmarks.bookmarkToolbar = currentNavigation.node.children;
            currentBookmarks.topLevel = false;
            node = currentNavigation.node;
            directory = currentNavigation.directory;
        } else {
            // Here we assume the current navigation action is 'GoToDirectory', which represents the user drilling down into their bookmark
            // hierarchy
            if (showLastDir) {
                if (currentDirectory) {
                    node = getNode(bookmarkData.children, currentDirectory.split('\\'));

                    if (node) {
                        currentBookmarks.bookmarkToolbar = node.children;
                        currentBookmarks.topLevel = false;
                        directory = node.path;
                    }
                } else {
                    directory = getApplicationData(STORAGE_CURRENT_DIRECTORY);

                    if (directory) {
                        node = getNode(bookmarkData.children, directory.split('\\'));

                        if (node) {
                            currentBookmarks.bookmarkToolbar = node.children;
                            currentBookmarks.topLevel = false;
                            directory = node.path;
                        }
                    } else {
                        currentBookmarks.bookmarkToolbar = bookmarkData.children[0].children;
                        currentBookmarks.bookmarkMenu = bookmarkData.children[1].children;
                    }
                }
            } else {
                if (currentDirectory) {
                    node = getNode(bookmarkData.children, currentDirectory.split('\\'));

                    if (node) {
                        currentBookmarks.bookmarkToolbar = node.children;
                        currentBookmarks.topLevel = false;
                        directory = node.path;
                    }
                } else {
                    currentBookmarks.bookmarkToolbar = bookmarkData.children[0].children;
                    currentBookmarks.bookmarkMenu = bookmarkData.children[1].children;
                }
            }
        }
    }

    setSessionData(STORAGE_CURRENT_NODE, JSON.stringify(node));
    setSessionData(STORAGE_CURRENT_DIRECTORY, directory);
    setApplicationData(STORAGE_CURRENT_DIRECTORY, directory);

    return currentBookmarks;
};
