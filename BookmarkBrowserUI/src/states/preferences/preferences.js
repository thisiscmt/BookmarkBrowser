angular.module('bookmarkBrowser.states.preferences', [
    'ui.router',

    'bookmarkBrowser.config',
    'bookmarkBrowser.services.sharedService'
]).config(function ($stateProvider) {
    $stateProvider.state('preferences', {
        url: '/preferences',
        views: {
            "main": {
                controller: 'PreferencesController',
                templateUrl: 'states/preferences/preferences.tpl.html'
            }
        },
        data: {
            title: "Preferences"
        }
    });
}).controller('PreferencesController', function PreferencesController($scope, $stateParams, applicationConfiguration, sharedService) {
    $scope.lastKnownDirectoryOnStartup = sharedService.getApplicationData("LastKnownDirectoryOnStartup");

    $scope.savePreferences = function savePreferences() {
        sharedService.setApplicationData("LastKnownDirectoryOnStartup", $scope.lastKnownDirectoryOnStartup);
        sharedService.setDisplayMessage("Preferences saved successfully");
    };

    sharedService.setTitle("Preferences");
});
