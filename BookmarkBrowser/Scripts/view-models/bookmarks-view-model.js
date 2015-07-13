var bookmarksViewModel = function () {
    var self = this;
    var currentBookmarks = JSON.parse(localStorage.getItem("CurrentBookmarks"));
    var curNode;
    var nodePath;
    var nodeData;

    var showLastDir = localStorage.getItem("LastDirOnStartup");

    if (showLastDir && showLastDir === "True") {
        nodeData = localStorage.getItem("CurrentNode");
    }
    else {
        nodeData = sessionStorage.getItem("CurrentNode");
    }

    // If we need to show a particular directory at bind time, fetch that directory's bookmark items
    if (nodeData) {
        curNode = JSON.parse(nodeData);
        $("#backButton").attr("data-nodepath", curNode.Path);
        nodePath = curNode.Path.split("\\");
        $("#bmHeader").html(nodePath[nodePath.length - 1]);

        self.BookmarksToolbar = ko.observableArray(curNode.BookmarkItems);
        self.BookmarksMenu = ko.observableArray([]);
        $("#toolbarDivider").hide();
        $("#menuDivider").hide();
    }
    else {
        self.BookmarksToolbar = ko.observableArray(currentBookmarks.BookmarkItems[0].BookmarkItems);
        self.BookmarksMenu = ko.observableArray(currentBookmarks.BookmarkItems[1].BookmarkItems);
        $("#bmHeader").html("Bookmarks");
    }

    self.setBookmarks = function (node) {
        if (node) {
            self.BookmarksToolbar(node.BookmarkItems);
            self.BookmarksMenu([]);
            sessionStorage.setItem("CurrentNode", JSON.stringify(node));
            localStorage.setItem("CurrentNode", JSON.stringify(node));

            $("#toolbarDivider").hide();
            $("#menuDivider").hide();
        }
        else {
            // We are back at the topmost level, so show the toolbar and menu bookmarks
            self.BookmarksToolbar(currentBookmarks.BookmarkItems[0].BookmarkItems);
            self.BookmarksMenu(currentBookmarks.BookmarkItems[1].BookmarkItems);
            sessionStorage.removeItem("CurrentNode");
            localStorage.removeItem("CurrentNode");
            $("#bmHeader").html("Bookmarks");

            $("#toolbarDivider").show();
            $("#menuDivider").show();
        }
    }

    self.removeBookmarks = function() {
        self.BookmarksToolbar([]);
        self.BookmarksMenu([]);
    }
};

function applyBindings() {
    ko.bindingHandlers.bookmarkItemType = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            $(element).find(".nameBlock").html(viewModel.Name);

            if (viewModel.ItemType === 0) {
                $(element).jqmData('icon', 'arrow-r');
                $(element).find("a").attr("onclick", "doNavigation(this);");
                $(element).find("img").attr("src", "Images/folder.png");
                $(element).find(".locationBlock").hide();
            }
            else if (viewModel.ItemType === 1) {
                $(element).find("a").attr("target", "_blank");
                $(element).find("img").attr("src", "Images/bookmark.png");
                $(element).find(".locationBlock").html(viewModel.Location).show();
            }
            else if (viewModel.ItemType === 2) {
                // TODO: Add code to adjust the list item to look like a spearator
            }
        }
    };

    ko.applyBindings(new bookmarksViewModel());
}
