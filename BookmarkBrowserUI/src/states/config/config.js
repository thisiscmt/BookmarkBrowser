angular.module('bookmarkBrowser.states.config', [
    'ui.router',
    'ngFileUpload',

    'bookmarkBrowser.config',
    'bookmarkBrowser.services.sharedService',
    'bookmarkBrowser.services.configService'
]).config(function ($stateProvider) {
    $stateProvider.state('config', {
        url: '/config',
        views: {
            "main": {
                controller: 'ConfigController',
                templateUrl: 'states/config/config.tpl.html'
            }
        },
        data: {
            title: "Configuration"
        }
    });
}).controller('ConfigController', function ConfigController($scope, $stateParams, Upload, applicationConfiguration, sharedService, configService) {
    $scope.isMobile = sharedService.isMobile.any();
    $scope.userName = sharedService.getApplicationData("UserName");
    $scope.password = sharedService.getApplicationData("Password") ? "********" : "";
    $scope.passwordChanged = false;
    $scope.hasBookmarkData = false;
    $scope.bookmarkCount = null;
    $scope.uploadTimestamp = null;
    $scope.uploadFile = null;
    $scope.uploadFileName = "";

    $scope.passwordChange = function passwordChange() {
        $scope.passwordChanged = true;
    };

    $scope.updateSelectedFile = function updateSelectedFile($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event) {
        if ($file) {
            $scope.uploadFile = $file;
            $scope.uploadFileName = $file.name;
        }
        else {
            $scope.uploadFile = null;
            $scope.uploadFileName = "";
        }
    };

    $scope.uploadBookmarkData = function uploadBookmarkData() {
        var reader = new FileReader();
        var password;
        var authHeader;
        var data = {};

        if ($scope.userName && $scope.password) {
            sharedService.setDisplayMessage("");

            reader.onload = function (event) {
                password = $scope.passwordChanged ? $scope.password : sharedService.getApplicationData("Password");
                authHeader = "Basic " + btoa($scope.userName + ":" + password);

                configService.uploadBookmarkData(event.target.result, authHeader).then(function () {
                    sharedService.setApplicationData("UserName", $scope.userName);

                    if ($scope.passwordChanged) {
                        sharedService.setApplicationData("Password", $scope.password);
                    }

                    $scope.uploadFile = null;
                    $scope.uploadFileName = "";
                    sharedService.setDisplayMessage("Bookmark data uploaded successfully");
                }).catch(function (error) {
                    sharedService.setDisplayMessage(sharedService.getErrorMessage(error));
                });
            };

            reader.readAsText($scope.uploadFile);
        }
        else {
            sharedService.setDisplayMessage("You must provide a username and password");
        }
    };

    $scope.downloadBookmarkData = function downloadBookmarkData() {
        var password;
        var authHeader;
        var response;

        if ($scope.userName && $scope.password) {
            sharedService.setDisplayMessage("");
            password = $scope.passwordChanged ? $scope.password : sharedService.getApplicationData("Password");
            authHeader = "Basic " + btoa($scope.userName + ":" + password);

            configService.downloadBookmarkData(authHeader).then(function (data) {
                sharedService.setApplicationData("UserName", $scope.userName);

                if ($scope.passwordChanged) {
                    sharedService.setApplicationData("Password", $scope.password);
                }

                response = JSON.parse(data.responseData);
                sharedService.setApplicationData("BookmarkData", response.bookmarkData);
                sharedService.setApplicationData("BookmarkCount", response.count);
                sharedService.setApplicationData("UploadTimestamp", response.uploadTimestamp);

                $scope.bookmarkCount = response.count;
                $scope.uploadTimestamp = response.uploadTimestamp;
                $scope.hasBookmarkData = true;
                sharedService.setDisplayMessage("Bookmark data refreshed successfully");
            }).catch(function (error) {
                sharedService.setDisplayMessage(sharedService.getErrorMessage(error));
            });
        }
        else {
            sharedService.setDisplayMessage("You must provide a username and password");
        }
    };

    sharedService.setTitle('Configuration');

    if (sharedService.getApplicationData("BookmarkData")) {
        $scope.bookmarkCount = sharedService.getApplicationData("BookmarkCount");
        $scope.uploadTimestamp = sharedService.getApplicationData("UploadTimestamp");
        $scope.hasBookmarkData = true;
    }
});
