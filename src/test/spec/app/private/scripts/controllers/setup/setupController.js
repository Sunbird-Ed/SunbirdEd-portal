'use strict';

describe('Controller: setupController', function () {
    beforeEach(module('playerApp'));
    var
        setupCtrl,
        scope,
        rootScope,
        searchService,
        setupService,
        toasterService,
        $q,
        deferred;
    beforeEach(inject(function ($controller, $rootScope, _searchService_,
          _setupService_,
          _toasterService_,
          _$q_) {
        rootScope = $rootScope;
        searchService = _searchService_;
        setupService = _setupService_;
        toasterService = _toasterService_;
        deferred = _$q_.defer();
        scope = $rootScope.$new();
        spyOn(searchService, 'getOrgTypeS').and.returnValue(deferred.promise);

        setupCtrl = $controller('setupController', {
            rootScope: rootScope,
            searchService: searchService,
            setupService: setupService
        });
    }
        ));
    it('should get all org types', (function (done) {
        spyOn(setupCtrl, 'getOrgTypes').and.callThrough();
        var mockRes = [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }];
        deferred.resolve(mockRes);
        setupCtrl.getOrgTypes();
        searchService.getOrgTypeS();
        scope.$apply();
        expect(setupCtrl.orgTypes).toEqual(mockRes);
        done();
    }));
    it('should open modal', (function (done) {
        spyOn($.fn, 'modal').and.callThrough();
        spyOn(setupCtrl, 'openUpdateModal').and.callThrough();
        setupCtrl.openUpdateModal('hello');
        setupCtrl.selectedOrg = {};
        expect(setupCtrl.selectedOrg.orgType).toEqual('hello');

        done();
    }));
});
