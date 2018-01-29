angular.module('bookmarkBrowser.services.sharedService', [
]).service('sharedService', function () {
    var _pageTitle = '';

    var _isMobile = {
        Android: function () {
            return !!navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return !!navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return !!navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return !!navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (_isMobile.Android() || _isMobile.BlackBerry() || _isMobile.iOS() || _isMobile.Opera() || _isMobile.Windows());
        }
    };

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
        isMobile        : _isMobile,
        setTitle        : _setTitle,
        getTitle        : _getTitle
        //scrollToTop   : _scrollToTop
    };
});
