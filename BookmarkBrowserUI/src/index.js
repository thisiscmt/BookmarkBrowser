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
    'bookmarkBrowser.states.preferences',
    'bookmarkBrowser.states.config',
    'bookmarkBrowser.states.error'
]).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $localStorageProvider, $sessionStorageProvider) {
    $localStorageProvider.setKeyPrefix("bmb");
    $sessionStorageProvider.setKeyPrefix("bmb");

    $urlRouterProvider.when("/index.html", "/");
    $urlRouterProvider.otherwise("/error");

    $locationProvider.html5Mode(true);
}).controller('MainController', function MainController($rootScope, $scope, $transitions, sharedService) {
    $scope.sharedService = sharedService;

    $transitions.onSuccess({}, function (transition) {
        sharedService.setCurrentPage(transition.to().data.title);
        sharedService.setDisplayMessage("");
    });

    $scope.$watch(sharedService.getTitle, function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
            $scope.pageTitle = newValue;
        }
    });
});
