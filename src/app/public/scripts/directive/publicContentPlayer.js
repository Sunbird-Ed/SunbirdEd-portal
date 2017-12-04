'use strict'

angular.module('loginApp')
    .directive('contentPlayer', [function () {
      return {
        templateUrl: 'views/contentplayer/player.html',
        restrict: 'E',
        scope: {
          id: '=',
          body: '=',
          visibility: '=',
          isshowmetaview: '=',
          isclose: '=',
          isheader: '=',
          height: '=',
          width: '=',
          ispercentage: '=',
          closeurl: '='
        },
            link: function (scope, element, attrs) { //eslint-disable-line
              if (scope.ispercentage) {
                $('#contentPlayer').css('height', scope.height + '%')
                $('#contentPlayer').css('width', scope.width + '%')
              } else {
                $('#contentPlayer').css('height', scope.height + 'px')
                $('#contentPlayer').css('width', scope.width + 'px')
              }
            },
        controller: 'contentPlayerCtrl'
      }
    }])
