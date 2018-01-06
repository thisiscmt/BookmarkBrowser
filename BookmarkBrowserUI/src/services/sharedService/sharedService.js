angular.module('bookmarkBrowser.services.sharedService', [
]).service('sharedService', function () {
    var _pageTitle = '';

    var _setTitle = function (title) {
        _pageTitle = title;
    };

    var _getTitle = function () {
        return _pageTitle;
    };

    //var _scrollToTop = function _scrollToTop(duration, top) {
    //    var finalDuration = 800;
    //    var finalTop = 0;

    //    if (duration) {
    //        finalDuration = duration;
    //    }

    //    if (top) {
    //        finalTop = top;
    //    }

    //    $('html, body').animate({ scrollTop: finalTop }, finalDuration);
    //};

    return {
        setTitle      : _setTitle,
        getTitle      : _getTitle
        //scrollToTop   : _scrollToTop
    };
});
