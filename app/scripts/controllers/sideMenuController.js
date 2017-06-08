'use strict';

angular.module('playerApp')
    .controller('sideMenuCtrl', function($scope, $rootScope, $location) {
        $scope.$on('$locationChangeSuccess', function() {
            $scope.currentPath = $location.path();
        });

        $rootScope.sideMenuData = [{
                'icon': 'large add circle icon',
                'name': 'Add Course',
                'children': [],
                'link': '#'
            },
            {
                'icon': 'large bookmark icon',
                'name': 'My Bookmarks',
                'children': [],
                'link': '#'
            },
            {
                'icon': 'large search icon',
                'name': 'Explore',
                'children': [],
                'link': '#'
            }
        ];
    });