angular.module('bookmarkBrowser.states.config', [
    'ui.router',

    'bookmarkBrowser.config',
    'bookmarkBrowser.services.sharedService'
]).config(function ($stateProvider) {
    $stateProvider.state('config', {
        url: '/config',
        views: {
            "main": {
                controller: 'ConfigController',
                templateUrl: 'states/config/config.tpl.html'
            }
        }
    });
}).controller('ConfigController', function ConfigController($scope, $stateParams, ApplicationConfiguration, sharedService) {
    sharedService.setTitle('Configuration');



});
