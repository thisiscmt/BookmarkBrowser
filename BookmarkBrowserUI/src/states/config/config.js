angular.module('bookmarkBrowser.states.config', [
    'ui.router',
    'ngFileUpload',

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
}).controller('ConfigController', function ConfigController($scope, $stateParams, ApplicationConfiguration, sharedService, fileUpload) {
    $scope.isMobile = sharedService.isMobile.any();





    sharedService.setTitle('Configuration');
});
