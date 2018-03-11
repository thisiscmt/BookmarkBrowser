angular.module('bookmarkBrowser.directives.bmbHeader', [
    'bookmarkBrowser.services.sharedService'
]).directive('bmbHeader', function ($rootScope, $timeout, $state, sharedService) {
    return {
        restrict: 'E',
        templateUrl: 'directives/bmbHeader/bmbHeader.tpl.html',
        scope: {
        },
        link: function ($scope, element, attrs) {
            $scope.currentPage = "";
            $scope.headerText = "";
            $scope.hasMessage = false;
            $scope.message = "";

            var setHeaderText = function setHeaderText() {
                var currentDirectory = sharedService.getSessionData("CurrentDirectory");

                if ($scope.currentPage === "Bookmarks") {
                    if (currentDirectory) {
                        if (currentDirectory === "Root") {
                            $scope.headerText = "Bookmarks";
                        }
                        else {
                            $scope.headerText = sharedService.getDirectoryFromPath(currentDirectory);
                        }
                    }
                    else {
                        $scope.headerText = "Bookmarks";
                    }
                }
                else {
                    $scope.headerText = $scope.currentPage;
                }
            };

            $scope.goBack = function goBack() {
                $rootScope.$broadcast("BMB_GoBack", { bookmark: sharedService.getSessionData("CurrentNode") });
            };

            $scope.goToTop = function goToTop() {
                $rootScope.$broadcast("BMB_GoToTop");
            };

            $scope.$watch(sharedService.getCurrentPage, function (newValue, oldValue) {
                if (newValue && newValue !== oldValue) {
                    $scope.currentPage = newValue;
                    setHeaderText();
                }
            });

            $scope.$watch(sharedService.getSessionData("CurrentDirectory"), function (newValue, oldValue) {
                if (newValue !== oldValue && newValue) {
                    setHeaderText();
                }
            });

            $scope.$watch(sharedService.getDisplayMessage, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.message = newValue;

                    if (newValue) {
                        $scope.hasMessage = true;
                    }
                    else {
                        $scope.hasMessage = false;
                    }
                }
            });

        }
    };
});
