angular.module('bookmarkBrowser', [
    'ui.router',
    'ngStorage',

    'bookmarkBrowser.templates',
    'bookmarkBrowser.config',
    'bookmarkBrowser.directives.bmbHeader',
    'bookmarkBrowser.directives.bmbFooter',
    'bookmarkBrowser.services.sharedService',
    'bookmarkBrowser.states.home',
    'bookmarkBrowser.states.bookmarks',
    'bookmarkBrowser.states.settings',
    'bookmarkBrowser.states.auth',
    'bookmarkBrowser.states.error'
]).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $localStorageProvider) {
    $localStorageProvider.setKeyPrefix("bmb");

    $urlRouterProvider.when("/index.html", "/");
    $urlRouterProvider.otherwise("/error");

    $locationProvider.html5Mode(true);
}).controller('MainController', function MainController($scope, sharedService) {
    $scope.currentDirectory = "Bookmarks";

    $scope.$watch(sharedService.getTitle, function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
            $scope.pageTitle = newValue;
        }
    });
});
