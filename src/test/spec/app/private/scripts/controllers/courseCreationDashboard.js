'use strict';

describe('Controller: courseCreatorDashboardCtrl', function() {
    var searchContentSucessData = { 'id': 'api.content.search', 'ver': '1.0', 'ts': '2017-05-16T13:14:52.357Z', 'params': { 'resmsgid': 'a593e750-3a39-11e7-8220-a95903fc2d3c', 'msgid': 'a5590130-3a39-11e7-8220-a95903fc2d3c', 'status': 'successful', 'err': null, 'errmsg': null }, 'responseCode': 'OK', 'result': { 'count': 1, 'content': [{ 'copyright': '', 'code': 'org.ekstep.asset. my country.2128998398', 'language': ['English'], 'mimeType': 'image/jpeg', 'idealScreenSize': 'normal', 'createdOn': '2016-12-07T10:45:25.600+0000', 'objectType': 'Content', 'gradeLevel': ['Grade 1'], 'lastUpdatedOn': '2017-03-08T08:29:43.115+0000', 'contentType': 'Asset', 'owner': '', 'identifier': 'do_10096841', 'visibility': 'Default', 'os': ['All'], 'portalOwner': '181', 'mediaType': 'image', 'ageGroup': ['5-6'], 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1488961783115', 'idealScreenDensity': 'hdpi', 'size': 53335, 'name': ' my country', 'publisher': '', 'status': 'Live', 'node_id': 94074, 'collections': ['do_112192746041712640178', 'do_112192669682491392119', 'do_1121933697898987521150', 'do_11219408274641715213', 'do_11219408967757824015', 'do_112194190920957952125', 'do_112195003023335424132'], 'compatibilityLevel': 1, 'osId': 'org.ekstep.launcher', 'es_metadata_id': 'do_10096841' }] } };

    // load the controller's module
    beforeEach(module('playerApp'));

    var courseCreatorDashboardCtrl, ContentCtrl,
        content,
        contentService,
        // Course
        dashboardService,
        $q,
        deferred;
    beforeEach(inject(function($controller, $rootScope, _dashboardService_, _$q_) {
        content = $rootScope.$new();
        $q = _$q_;
        deferred = $q.defer();
        dashboardService = _dashboardService_;
        spyOn(dashboardService, 'search').and.returnValue(deferred.promise);
        courseCreatorDashboardCtrl = $controller('courseCreatorDashboardCtrl', { $scope: content });
        spyOn(courseCreatorDashboardCtrl, 'searchContent').and.callThrough();
    }));
});
