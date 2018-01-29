angular.module('bookmarkBrowser.states.home', [
    'ui.router',

    'bookmarkBrowser.config',
    'bookmarkBrowser.services.sharedService'
]).config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        views: {
            "main": {
                controller: 'HomeController',
                templateUrl: 'states/home/home.tpl.html'
            }
        }
    });
}).controller('HomeController', function HomeController($scope, $stateParams, applicationConfiguration, sharedService) {
    sharedService.setTitle("Home");


});
