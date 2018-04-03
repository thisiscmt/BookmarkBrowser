angular.module('bookmarkBrowser.directives.bmbHeader', [
]).directive('bmbHeader', function ($rootScope, $timeout, $state) {
    return {
        restrict: 'E',
        templateUrl: 'directives/bmbHeader/bmbHeader.tpl.html',
        scope: {
            sharedService: "="
        },
        link: function ($scope, element, attrs) {
            $scope.currentPage = "";
            $scope.headerText = "";
            $scope.hasMessage = false;
            $scope.message = "";

            var setHeaderText = function setHeaderText() {
                var currentDirectory = $scope.sharedService.getSessionData("CurrentDirectory");

                if ($scope.currentPage === "Bookmarks") {
                    if (currentDirectory) {
                        if (currentDirectory === "Root") {
                            $scope.headerText = "Bookmarks";
                        }
                        else {
                            $scope.headerText = $scope.sharedService.getDirectoryFromPath(currentDirectory);
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
                $rootScope.$broadcast("BMB_GoBack", { bookmark: $scope.sharedService.getSessionData("CurrentNode") });
            };

            $scope.goToTop = function goToTop() {
                $rootScope.$broadcast("BMB_GoToTop");
            };

            $scope.$watch(function () {
                return $scope.sharedService.getCurrentPage();
            }, function (newValue, oldValue) {
                if (newValue && newValue !== oldValue) {
                    $scope.currentPage = newValue;
                    setHeaderText();
                }
            });

            $scope.$watch(function () {
                return $scope.sharedService.getSessionData("CurrentDirectory");
            }, function (newValue, oldValue) {
                if (newValue !== oldValue && newValue) {
                    setHeaderText();
                }
            });

            $scope.$watch(function () {
                return $scope.sharedService.getDisplayMessage();
            }, function (newValue, oldValue) {
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
