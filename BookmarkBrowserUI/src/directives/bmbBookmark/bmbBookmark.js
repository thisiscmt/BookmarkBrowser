angular.module('bookmarkBrowser.directives.bmbBookmark', [
]).directive('bmbBookmark', function ($state) {
    return {
        restrict: 'E',
        templateUrl: 'directives/bmbBookmark/bmbBookmark.tpl.html',
        scope: {
            bookmark: '='
        },
        link: function ($scope, element, attrs) {
            $scope.directoryImage = "images/folder.png";
            $scope.bookmarkImage = "images/bookmark.png";

            $scope.goToDirectory = function goToDirectory(bookmark) {
                $scope.$emit("BMB_GoToDirectory", { bookmark: bookmark });
            };
        }
    };
});
