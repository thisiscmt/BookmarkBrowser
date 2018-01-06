angular.module('bookmarkBrowser.directives.bmbHeader', [
]).directive('bmbHeader', function ($state) {
    return {
        restrict: 'E',
        templateUrl: 'directives/bmbHeader/bmbHeader.tpl.html',
        scope: {
            currentDirectory: '='
        },
        link: function ($scope, element, attrs) {
            $scope.currentState = $state.current.name;
            $scope.hasMessage = false;
            $scope.message = "";

            $scope.goBack = function goBack() {

            };

            $scope.goToTop = function goToTop() {

            };
        }
    };
});
