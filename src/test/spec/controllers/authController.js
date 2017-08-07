'use strict';

describe('Controller:AuthCtrl', function() {
    // load the controller's module
    beforeEach(module('playerApp'));

    var AuthCtrl,
        scope,
        authService,
        $q,
        deferred, timeout, $state;

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
            'source': 'android',
            'firstName': 'user1',
            'token': '4eb30018-d781-3b82-b87a-7fc09cb86b1f',
            'userId': 'user1'
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

    var sucessUserProfileResponse = {
        'id': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
        'ver': 'v1',
        'ts': '2017-06-07 03:18:08:239+0530',
        'params': {
            'resmsgid': null,
            'msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'lastName': null,
                'aadhaarNo': null,
                'gender': null,
                'city': null,
                'language': 'English',
                'avatar': null,
                'updatedDate': null,
                'userName': 'amit.kumar@tarento.com',
                'userId': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2',
                'zipcode': null,
                'firstName': 'Amit',
                'lastLoginTime': null,
                'createdDate': '2017-06-07 10:35:50:558+0530',
                'phone': null,
                'state': null,
                'email': 'amit.kumar@tarento.com',
                'status': 1
            }
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
    beforeEach(inject(function($controller, $rootScope, _$q_, _authService_, _$timeout_, _$state_) {
        scope = $rootScope.$new();
        $q = _$q_;
        deferred = $q.defer();
        authService = _authService_;
        timeout = _$timeout_;
        $state = _$state_;

        AuthCtrl = $controller('AuthCtrl', {
            $scope: scope
        });
        spyOn(authService, 'login').and.returnValue(deferred.promise);
        spyOn(authService, 'logout').and.returnValue(deferred.promise);
        spyOn(authService, 'getUserProfile').and.returnValue(deferred.promise);
        spyOn(AuthCtrl, 'login').and.callThrough();
        spyOn(AuthCtrl, 'userProfile').and.callThrough();
        spyOn(AuthCtrl, 'processUserLogin').and.callThrough();
        spyOn(AuthCtrl, 'logout').and.callThrough();
    }));

    it('should login user', (function(done) {
        deferred.resolve(successLoginResponse);
        deferred.resolve(successUserProfileResponse);
        spyOn(AuthCtrl, 'closeAuthModal').and.callThrough();
        AuthCtrl.login();
        authService.login();
        AuthCtrl.processUserLogin(successLoginResponse);
        authService.getUserProfile('123');
        scope.$apply();
        expect(AuthCtrl.login).toHaveBeenCalled();
        expect(authService.login).toHaveBeenCalled();
        // expect($state.go).toHaveBeenCalledWith('Search');
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
    it('should handle api login user error ', (function(done) {
        deferred.reject('');
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
        deferred.reject('');
        AuthCtrl.logout();
        authService.logout();

        timeout.flush(2000);
        scope.$apply();
        expect(AuthCtrl.logout).toHaveBeenCalled();
        expect(authService.logout).toHaveBeenCalled();
        done();
    }));
});