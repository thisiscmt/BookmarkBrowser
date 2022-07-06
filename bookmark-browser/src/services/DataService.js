import WebStorage from 'webStorage';

class DataService {
    constructor() {
        this.appData = WebStorage.createInstance({
            driver: localStorage,
            name: 'bmb',
            keySeparator: '_'
        });

        this.sessionData = WebStorage.createInstance({
            driver: sessionStorage,
            name: 'bmb',
            keySeparator: '_'
        });
    }

    setApplicationData = (key, value) => {
        this.appData.setItem(key, value);
    };

    getApplicationData = (key) => {
        return this.appData.getItem(key);
    };

    removeApplicationData = (key) => {
        this.appData.removeItem(key);
    };

    setSessionData = (key, value) => {
        this.sessionData.setItem(key, value);
    };

    getSessionData = (key) => {
        return this.sessionData.getItem(key);
    };

    removeSessionData = (key) => {
        this.sessionData.removeItem(key);
    };

    getNode = (items, path) => {
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
                if (items[i].title === directory && items[i].type === 'Directory') {
                    // We know to stop when we've found the final directory in the node's path
                    if (path.length === 0) {
                        bookmark = items[i];
                        break;
                    }
                    else {
                        bookmark = this.getNode(items[i].children, path);
                        break;
                    }
                }
            }
        }

        return bookmark;
    };

    getCurrentBookmarks = (currentNavigation) => {
        const bookmarkData = this.getApplicationData('BookmarkData');
        const showLastDir = this.getApplicationData('LastKnownDirectoryOnStartup');
        const currentDirectory = this.getSessionData('CurrentDirectory');

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
                    node = this.getNode(bookmarkData.children, path);
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
                        node = this.getNode(bookmarkData.children, currentDirectory.split('\\'));

                        if (node) {
                            currentBookmarks.bookmarkToolbar = node.children;
                            currentBookmarks.topLevel = false;
                            directory = node.path;
                        }
                    } else {
                        directory = this.getApplicationData('CurrentDirectory');

                        if (directory) {
                            node = this.getNode(bookmarkData.children, directory.split('\\'));

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
                        node = this.getNode(bookmarkData.children, currentDirectory.split('\\'));

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

        this.setSessionData('CurrentNode', node);
        this.setSessionData('CurrentDirectory', directory);
        this.setApplicationData('CurrentDirectory', directory);

        return currentBookmarks;
    };
}

export default DataService;
