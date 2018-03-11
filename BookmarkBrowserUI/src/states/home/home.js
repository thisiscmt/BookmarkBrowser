angular.module('bookmarkBrowser.states.home', [
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
        },
        data: {
            title: "Home"
        }
    });
}).controller('HomeController', function HomeController($scope, applicationConfiguration, sharedService) {
    sharedService.setTitle("Home");
});
