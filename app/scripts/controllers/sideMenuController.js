'use strict';

angular.module('playerApp')
    .controller('sideMenuCtrl', function($scope) {
    var sideMenu = this;

    $scope.sideMenuData=[{
                "name":"Menu1",
                "children":[
                {
                "name":"Menu11",
                "children":[
                ]
                },
                {
                "name":"Menu12",
                "children":[
                {
                "name":"Menu121",
                "children":[
                ]
                },
                {
                "name":"Menu122",
                "children":[
                ]
                }
                ]
                }
                ]
            }]

});