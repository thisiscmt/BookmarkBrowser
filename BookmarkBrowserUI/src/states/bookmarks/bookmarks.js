angular.module('bookmarkBrowser.states.bookmarks', [
    'ui.router',

    'bookmarkBrowser.config',
    'bookmarkBrowser.services.sharedService'
]).config(function ($stateProvider) {
    $stateProvider.state('bookmarks', {
        url: '/bookmarks',
        views: {
            "main": {
                controller: 'BookmarksController',
                templateUrl: 'states/bookmarks/bookmarks.tpl.html'
            }
        }
    });
}).controller('BookmarksController', function BookmarksController($scope, $stateParams, applicationConfiguration, sharedService) {

    //function doNavigation(sender) {
    //    var nodePath;
    //    var newHeader;
    //    var newPath;

    //    if (sender.id === "backButton") {
    //        nodePath = $(sender).attr("data-nodepath").split("\\");
    //        nodePath.pop();

    //        if (nodePath.length === 0) {
    //            return;
    //        }

    //        if (nodePath.length === 2) {
    //            newPath = "Root";
    //            newHeader = "Bookmarks";
    //        }
    //        else {
    //            newPath = nodePath.join("\\");
    //            nodePath.shift();
    //            newHeader = nodePath[nodePath.length - 1];
    //        }

    //        $("#backButton").attr("data-nodepath", newPath);
    //    }
    //    else if (sender.id === "topButton") {
    //        if ($("#backButton").attr("data-nodepath") === "Root") {
    //            return;
    //        }

    //        newHeader = "Bookmarks";
    //        $("#backButton").attr("data-nodepath", "Root");
    //    }
    //    else {
    //        nodePath = $(sender).attr("data-nodepath").split("\\");
    //        nodePath.shift();
    //        newHeader = nodePath[nodePath.length - 1];
    //        $("#backButton").attr("data-nodepath", $(sender).attr("data-nodepath"));
    //    }

    //    var currentBookmarks = JSON.parse(localStorage.getItem("CurrentBookmarks"));
    //    var curNode = getNode(currentBookmarks.BookmarkItems, nodePath);
    //    ko.dataFor($("#bookmarkContainer")[0]).setBookmarks(curNode);
    //    $("#bmHeader").html(newHeader);
    //    $("body").pagecontainer("change", "#Bookmarks", { transition: "fade", allowSamePageTransition: true });
    //}

    //function getNode(items, nodePath) {
    //    var curDir;
    //    var node = null;

    //    if (nodePath) {
    //        curDir = nodePath.shift();

    //        for (var i = 0; i < items.length; i++) {
    //            if (items[i].Name === curDir && items[i].ItemType === 0) {
    //                // We know to stop when we've found the final directory in the node's path
    //                if (nodePath.length === 0) {
    //                    node = items[i];
    //                    break;
    //                }
    //                else {
    //                    node = getNode(items[i].BookmarkItems, nodePath);
    //                    break;
    //                }
    //            }
    //        }
    //    }

    //    return node;
    //}



    sharedService.setTitle('Bookmarks');
});
