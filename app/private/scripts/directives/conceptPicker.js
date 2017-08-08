'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:conceptPicker
 * @description
 * # conceptPicker
 */
angular.module('playerApp').directive('conceptPicker', function () {
    var controller = ['$scope', '$rootScope', 'config', '$timeout', '$state', '$stateParams'
                , 'searchService', 'toasterService', '$location', 'sessionService', 'adminService',
        function ($scope, $rootScope, config, $timeout, $state, $stateParams,
                searchService, toasterService, $location, sessionService, adminService) {

            /*
             * load concepts section
             */
            $scope.loadConceptTree = function () {
                $scope.conceptLoader = toasterService.loader('', $rootScope.errorMessages.WORKSPACE.CONCEPTS.START);
                $scope.concepts = [];
                $scope.getConcept(0, 200, function (err) {
                    if (err === true) {
                        toasterService.error($rootScope.errorMessages.WORKSPACE.GET.FAILED);
                    } else {
                        var domains = [];
                        var req = {
                            "filters": {
                                "objectType": ["Dimension", "Domain"]
                            },
                            params: {
                                cid: '12'
                            },

                        };
                        /**Get domains and dimensions data**/
                        searchService.search(req).then(function (resp) {
                            if (resp.result && _.isArray(resp.result.domains)) {
                                _.forEach(resp.result.domains, function (value) {
                                    var domain = {};
                                    domain.id = value.identifier;
                                    domain.name = value.name;
                                    var domainChild = [];
                                    /**Get domain child**/
                                    _.forEach($scope.getChild(value.identifier, resp.result.dimensions), function (value) {
                                        var dimension = {};
                                        dimension.id = value.id;
                                        dimension.name = value.name;
                                        /**Get dimension child**/
                                        dimension.nodes = $scope.getChild(value.id, $scope.concepts);
                                        domainChild.push(dimension);
                                    });
                                    domain.nodes = domainChild;
                                    domains.push(domain);
                                });
                                $rootScope.conceptData = domains;
                                $scope.conceptLoader.showLoader = false;
                                $scope.initConceptBrowser();

                            }
                        });
                    }
                });

            };

            $scope.initConceptBrowser = function () {
                $scope.selectedConcepts = $scope.selectedConcepts || [];
                if ($scope.isSearchPage === true) {
                    $scope.contentConcepts = $scope.selectedConcepts;
                } else {
                    $scope.contentConcepts = _.map($scope.selectedConcepts, "identifier");
                }
                $scope.pickerMessage = $scope.contentConcepts.length+ ' concepts selected';
                $timeout(function () {
                    $('#treePicker').treePicker({
                        data: $rootScope.conceptData,
                        name: 'Concepts',
                        picked: $scope.contentConcepts,
                        onSubmit: function (nodes) {
                            $('#treePicker').val(nodes.length + ' concepts selected');
                            $scope.contentConcepts = [];
                            _.forEach(nodes, function (obj) {
                                $scope.contentConcepts.push({
                                    identifier: obj.id,
                                    name: obj.name
                                });
                            });
                            $scope.selectedConcepts=$scope.contentConcepts;
                            $rootScope.$broadcast('selectedConcepts', {
                                selectedConcepts: $scope.selectedConcepts
                            });

                        },
                        nodeName: "conceptSelector_treePicker",
                        minSearchQueryLength: 1
                    });
                }, 1000);
            };


            /**Get child recursively**/
            $scope.getChild = function (id, resp) {
                var childArray = [];
                _.forEach(resp, function (value) {
                    if (value.parent != undefined) {
                        if (value.parent[0] == id) {
                            var child = {};
                            child.id = value.identifier;
                            child.name = value.name;
                            child.selectable = "selectable";

                            /**Get concept child recursively**/
                            child.nodes = $scope.getChild(value.identifier, resp);
                            childArray.push(child);
                        }
                    }
                });
                return _.uniqBy(childArray, "id");
            }


            $scope.getConcept = function (offset, limit, callback) {
                var req = {
                    "filters": {
                        "objectType": ["Concept"]
                    },
                    offset: offset,
                    limit: limit
                };
                searchService.search(req).then(function (res) {
                    if (res.result && res.result && _.isArray(res.result.concepts)) {
                        _.forEach(res.result.concepts, function (value) {
                            $scope.concepts.push(value);
                        });
                        if ((res.result.count > offset) && res.result.count >= (offset + limit)) {
                            offset = offset + limit;
                            $scope.getConcept(offset, limit, callback)
                        } else {
                            callback(false);
                        }

                    }
                }).
                        catch(function (err) {
                            callback(true);
                        });
            }
            if (!$rootScope.conceptData) {
                $scope.loadConceptTree();
            }
            else{
               $scope.initConceptBrowser(); 
            }
        }];
    return {
        templateUrl: 'views/common/conceptSelector.html',
        restrict: 'E',
        scope: {
            type: '=',
            selectedConcepts: '=',
            isSearchPage: '='
        },
        link: function (scope, element, attrs) {
            
        },
        controller: controller
    };
});