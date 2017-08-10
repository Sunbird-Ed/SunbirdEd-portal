'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:conceptPicker
 * @description
 * # conceptPicker
 */
angular.module('playerApp').directive('conceptPicker', function () {
    var controller = ['$scope', '$rootScope', '$timeout',
        'searchService', 'toasterService',
        function ($scope, $rootScope, $timeout,
                searchService, toasterService) {
            /*
             * load concepts section
             */
            $scope.loadConceptTree = function () {
                $scope.conceptLoader = toasterService.loader(''
                , $rootScope.errorMessages.WORKSPACE.CONCEPTS.START);
                if ($rootScope.concepts) {
                    $scope.loadDomains(false, $rootScope.concepts);
                } else {
                    $rootScope.getConcept(0, 200, $scope.loadDomains);
                }
            };
            $scope.loadDomains = function (err, conceptArr) {
                if (err && err === true) {
                    toasterService.error($rootScope.errorMessages.WORKSPACE.GET.FAILED);
                } else {
                    $rootScope.concepts = conceptArr;
                    var domains = [];
                    var req = {
                        filters: {
                            objectType: ['Dimension', 'Domain']
                        },
                        params: {
                            cid: '12'
                        }

                    };
                        /** Get domains and dimensions data* */
                    searchService.search(req).then(function (resp) {
                        if (resp.result && _.isArray(resp.result.domains)) {
                            _.forEach(resp.result.domains, function (value) {
                                var domain = {};
                                domain.id = value.identifier;
                                domain.name = value.name;
                                var domainChild = [];
                                    /** Get domain child* */
                                _.forEach($scope.getChild(value.identifier
                                        , resp.result.dimensions),
                                     function (val) {
                                         var dimension = {};
                                         dimension.id = val.id;
                                         dimension.name = val.name;
                                        /** Get dimension child* */
                                         dimension.nodes = $scope.getChild(val.id, $rootScope.concepts);
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
            };
            $scope.initConceptBrowser = function () {
                $scope.selectedConcepts = $scope.selectedConcepts || [];
                $scope.contentConcepts = _.map($scope.selectedConcepts, 'identifier');
                $scope.pickerMessage = $scope.contentConcepts.length + ' concepts selected';
                $('#treePicker').val($scope.pickerMessage);
                $timeout(function () {
                    $('#treePicker').treePicker({
                        data: $rootScope.conceptData,
                        name: 'Concepts',
                        picked: $scope.contentConcepts,
                        onSubmit: function (nodes) {
                            $('#treePicker').val(nodes.length + ' concepts selected');
                            _.defer(function () {
                                $scope.$apply();
                            });
                            $scope.contentConcepts = [];
                            _.forEach(nodes, function (obj) {
                                $scope.contentConcepts.push({
                                    identifier: obj.id,
                                    name: obj.name
                                });
                            });
                            $scope.selectedConcepts = $scope.contentConcepts;

                            $rootScope.$broadcast('selectedConcepts', {
                                selectedConcepts: $scope.selectedConcepts
                            });
                        },
                        nodeName: 'conceptSelector_treePicker',
                        minSearchQueryLength: 1
                    });
                }, 500);
            };

            /** Get child recursively* */
            $scope.getChild = function (id, resp) {
                var childArray = [];
                _.forEach(resp, function (value) {
                    if (value.parent !== undefined) {
                        if (value.parent[0] === id) {
                            var child = {};
                            child.id = value.identifier;
                            child.name = value.name;
                            child.selectable = 'selectable';

                            /** Get concept child recursively* */
                            child.nodes = $scope.getChild(value.identifier, resp);
                            childArray.push(child);
                        }
                    }
                });
                return _.uniqBy(childArray, 'id');
            };

            if (!$rootScope.conceptData) {
                $scope.loadConceptTree();
            } else {
                $scope.initConceptBrowser();
            }
            if ($scope.isSearchPage) {
                $rootScope.$on('selectedConceptsFromSearch', function (event, args) {
                    $scope.selectedConcepts = args.selectedConcepts;
                    $scope.initConceptBrowser();
                });
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
