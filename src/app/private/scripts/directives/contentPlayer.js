'use strict'

angular.module('playerApp')
    .directive('contentPlayer', function () {
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
          closeurl: '=',
          isworkspace: '='
        },
            link: function (scope, element, attrs) { //eslint-disable-line
              if (scope.ispercentage) {
                $('#contentPlayer').css('height', scope.height + '%')
                $('#contentPlayer').css('width', scope.width + '%')
              } else {
                $('#contentPlayer').css('height', scope.height + 'px')
                $('#contentPlayer').css('width', scope.width + 'px')
              }

              scope.$watch('body', function (newValue, oldValue) {
                if (oldValue) {
                  if (newValue.identifier && newValue.identifier !== oldValue.identifier) {
                    scope.updateContent(scope)
                  }
                } else if (oldValue === undefined) {
                  scope.updateContent(scope)
                }
              })
              scope.$watch('id', function () {
                scope.updateContent(scope)
              })
            },
        controller: 'contentPlayerCtrl'
      }
    })
