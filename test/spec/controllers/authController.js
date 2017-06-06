'use strict';

describe('Controller:AuthCtrl', function() {
    // load the controller's module
    beforeEach(module('playerApp'));

    var AuthCtrl,
        scope,
        authService,
        $q,
        deferred, timeout;

    var successLoginResponse = {
        'id': 'sunbird.login',
        ver: '1.0',
        ts: '2017-05-136 10:49:58:600+0530',
        params: {
            resmsgid: '7 c27cbf5 - e299 - 43 b0 - bca7 - 8347 f7e5abcf',
            msgid: '8e27 cbf5 - e299 - 43 b0 - bca7 - 8347 f7e5abcf',
            err: null,
            status: 'success',
            errmsg: null
        },
        responseCode: 'OK',
        result: {
            'authToken': 'token123',
            'firstName': 'firstname'
        }
    };

    var successLogoutResponse = {
        'id': '7c27cbf5-e299-43b0-bca7-8347f7e5abcf',
        'ver': 'v1',
        'ts': '2017-05-136 10:49:58:600+0530',
        'params': {
            'resmsgid': null,
            'msgid': null,
            'err': 'SUCCESS',
            'status': 'success',
            'errmsg': 'Success'
        },
        'responseCode': 'OK',
        'result': {

        }
    };

    // beforeEach(function() {
    //     form = $('<form>');
    //     $(document.body).append(form);
    // });
    // afterEach(function() {
    //     form.remove();
    //     form = null;
    // });

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, _$q_, _authService_, _$timeout_) {
        scope = $rootScope.$new();
        $q = _$q_;
        deferred = $q.defer();
        authService = _authService_;
        timeout = _$timeout_;
        spyOn(authService, 'login').and.returnValue(deferred.promise);
        spyOn(authService, 'logout').and.returnValue(deferred.promise);
        AuthCtrl = $controller('AuthCtrl', {
            $scope: scope
        });
        spyOn(AuthCtrl, 'login').and.callThrough();
        spyOn(AuthCtrl, 'logout').and.callThrough();
    }));

    it('should login user', (function(done) {
        deferred.resolve(successLoginResponse);
        spyOn(AuthCtrl, 'closeAuthModal').and.callThrough();
        AuthCtrl.login();
        authService.login();
        scope.$apply();
        expect(AuthCtrl.login).toHaveBeenCalled();
        expect(authService.login).toHaveBeenCalled();
        done();
    }));
    it('should fail login user', (function(done) {
        deferred.resolve('');
        AuthCtrl.login();
        authService.login();
        timeout.flush(2000);
        scope.$apply();
        expect(AuthCtrl.login).toHaveBeenCalled();
        expect(authService.login).toHaveBeenCalled();
        done();
    }));
    it('should handle api logout user error ', (function(done) {
        deferred.reject();
        AuthCtrl.login();
        authService.login();

        timeout.flush(2000);
        scope.$apply();
        expect(AuthCtrl.login).toHaveBeenCalled();
        expect(authService.login).toHaveBeenCalled();
        done();
    }));
    it('should logout user', (function(done) {
        deferred.resolve(successLogoutResponse);
        AuthCtrl.logout();
        authService.logout();
        scope.$apply();
        expect(AuthCtrl.logout).toHaveBeenCalled();
        expect(authService.logout).toHaveBeenCalled();
        done();
    }));

    it('should fail logout user', (function(done) {
        deferred.resolve('');
        AuthCtrl.logout();
        authService.logout();

        timeout.flush(2000);
        scope.$apply();
        expect(AuthCtrl.logout).toHaveBeenCalled();
        expect(authService.logout).toHaveBeenCalled();
        done();
    }));
    it('should handle api logout user error ', (function(done) {
        deferred.reject();
        AuthCtrl.logout();
        authService.logout();

        timeout.flush(2000);
        scope.$apply();
        expect(AuthCtrl.logout).toHaveBeenCalled();
        expect(authService.logout).toHaveBeenCalled();
        done();
    }));
});