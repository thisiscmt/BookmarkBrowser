angular.module('bookmarkBrowser.states.bookmarks', [
    'ui.router',

    'bookmarkBrowser.config',
    'bookmarkBrowser.services.sharedService',
    'bookmarkBrowser.directives.bmbBookmark'
]).config(function ($stateProvider) {
    $stateProvider.state('bookmarks', {
        url: '/bookmarks',
        views: {
            "main": {
                controller: 'BookmarksController',
                templateUrl: 'states/bookmarks/bookmarks.tpl.html'
            }
        },
        data: {
            title: "Bookmarks"
        }
    });
}).controller('BookmarksController', function BookmarksController($scope, $stateParams, applicationConfiguration, sharedService) {
    $scope.bookmarkToolbar = [];
    $scope.bookmarkMenu = [];
    $scope.topLevel = false;

    var initializePage = function initializePage() {
        var currentBookmarks = sharedService.getApplicationData("BookmarkData");
        var showLastDir = sharedService.getApplicationData("LastKnownDirectoryOnStartup");
        var currentDirectory = sharedService.getSessionData("CurrentDirectory");

        if (currentBookmarks) {
            if (showLastDir) {
                if (currentDirectory) {
                    setBookmarks(getNode(currentBookmarks.children, currentDirectory.split("\\")));
                }
                else {
                    currentDirectory = sharedService.getApplicationData("CurrentDirectory");

                    if (currentDirectory) {
                        setBookmarks(getNode(currentBookmarks.children, currentDirectory.split("\\")));
                    }
                    else {
                        setBookmarks();
                    }
                }
            }
            else {
                if (currentDirectory) {
                    setBookmarks(getNode(currentBookmarks.children, currentDirectory.split("\\")));
                }
                else {
                    setBookmarks();
                }
            }
        }
        else {
            sharedService.setDisplayMessage("Go to the Config page to refresh your bookmark data");
        }
    };

    var setBookmarks = function setBookmarks(node) {
        var currentBookmarks;

        if (node) {
            $scope.bookmarkToolbar = node.children;
            $scope.bookmarkMenu = [];
            sharedService.setSessionData("CurrentNode", node);
            sharedService.setSessionData("CurrentDirectory", node.path);
            sharedService.setApplicationData("CurrentDirectory", node.path);

            $scope.topLevel = false;
        }
        else {
            // We are back at the topmost level, so show the toolbar and menu bookmarks
            currentBookmarks = sharedService.getApplicationData("BookmarkData");

            $scope.bookmarkToolbar = currentBookmarks.children[0].children;
            $scope.bookmarkMenu = currentBookmarks.children[1].children;
            sharedService.removeSessionData("CurrentNode");
            sharedService.setSessionData("CurrentDirectory", "Root");
            sharedService.removeApplicationData("CurrentDirectory");

            $scope.topLevel = true;
        }
    };

    var getNode = function getNode(items, path) {
        var directory;
        var bookmark = null;

        if (path) {
            // If the first directory in the path is 'Root', take it out since it doesn't represent a real bookmark and would cause the search 
            // to fail
            if (path[0] === "Root") {
                path.shift();
            }

            directory = path.shift();

            for (var i = 0; i < items.length; i++) {
                if (items[i].title === directory && items[i].type === "Directory") {
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

    $scope.$on("BMB_GoBack", function (event, args) {
        var path = args.bookmark.path.split("\\");
        var currentBookmarks = sharedService.getApplicationData("BookmarkData");
        var bookmark;

        if (path.length <= 3) {
            setBookmarks();
        }
        else {
            path.splice(path.length - 1, 1);
            path.splice(0, 1);
            bookmark = getNode(currentBookmarks.children, path);
            setBookmarks(bookmark);
        }
    });

    $scope.$on("BMB_GoToTop", function (event, args) {
        setBookmarks();
    });

    $scope.$on("BMB_GoToDirectory", function (event, args) {
        setBookmarks(args.bookmark);
        event.stopPropagation();
    });

    sharedService.setTitle('Bookmarks');
    initializePage();
});
