'use strict';

/**
 * @ngdoc service
 * @name playerApp.adminService
 * @description
 * # adminService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('adminService', ['config', 'httpServiceJava', '$rootScope', 'portalTelemetryService', '$q',
        function (config, httpServiceJava, $rootScope, portalTelemetryService, $q) {
            this.searchUser = function (req) {
                var url = config.URL.ADMIN.USER_SEARCH;

                var res = {
                    id: null,
                    ver: 'v1',
                    ts: '2017-08-01 12:07:03:860+0000',
                    params: {
                        resmsgid: null,
                        msgid: '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
                        err: null,
                        status: 'success',
                        errmsg: null
                    },
                    responseCode: 'OK',
                    result: {
                        response: {
                            response: [
                                {
                                    lastName: 'kumar',
                                    loginId: null,

                                    gender: 'male',
                                    regOrgId: '32iu0e41972be9280f758999',
                                    subject: [
                                        'Physics',
                                        'Math',
                                        'English'
                                    ],
                                    roles: [
                                        'public'
                                    ],
                                    organisation: [],
                                    language: [
                                        'English',
                                        'Hindi',
                                        'Marathi',
                                        'Tamil'
                                    ],
                                    updatedDate: '2017-07-11 10:43:00:214+0000',
                                    provider: null,
                                    email: 'amit7113.kumar7113@tarento.com',
                                    identifier: '5ac2edd3-8d2e-49a4-ac86-9ed5c2e10f3e',
                                    thumbnail: null,

                                    aadhaarNo: '',
                                    avatar: null,
                                    userName: 'amit7113.kumar7113',
                                    rootOrgId: '32iu0e41972be9280f754e94',
                                    userId: '5ac2edd3-8d2e-49a4-ac86-9ed5c2e10f3e',
                                    firstName: 'Amit',
                                    lastLoginTime: null,
                                    createdDate: '2017-07-04 11:50:41:916+0000',
                                    phone: '990003212112',
                                    dob: '1992-12-10',
                                    status: 1
                                },
                                {
                                    lastName: 'Kumar1',
                                    loginId: 'amit93.kumar93@null',

                                    gender: 'male',
                                    regOrgId: '32iu0e41972be9280f758999',
                                    subject: [
                                        'Physics',
                                        'Math',
                                        'English'
                                    ],
                                    roles: [
                                        'public'
                                    ],
                                    organisation: [],
                                    language: [
                                        'English',
                                        'Hindi'
                                    ],
                                    updatedDate: '2017-07-08 12:56:24:107+0000',
                                    provider: null,
                                    email: 'amit93.kumar93@tarento.com',
                                    identifier: 'fd32bc48-8bf4-46f1-b3ae-55a45fa04281',
                                    thumbnail: null,

                                    aadhaarNo: '',
                                    avatar: null,
                                    userName: 'amit93.kumar93',
                                    rootOrgId: '32iu0e41972be9280f754e94',
                                    userId: 'fd32bc48-8bf4-46f1-b3ae-55a45fa04281',
                                    firstName: 'Amit',
                                    lastLoginTime: null,
                                    createdDate: '2017-07-08 12:52:43:730+0000',
                                    phone: '9900032121',
                                    dob: '1992-10-12',
                                    status: 1
                                },
                                {
                                    lastName: 'Kumar2',
                                    loginId: 'amit93.kumar93@null',

                                    gender: 'male',
                                    regOrgId: '32iu0e41972be9280f758999',
                                    subject: [
                                        'Physics',
                                        'Math',
                                        'English'
                                    ],
                                    roles: [
                                        'public'
                                    ],
                                    organisation: [],
                                    language: [
                                        'English',
                                        'Hindi'
                                    ],
                                    updatedDate: '2017-07-08 12:56:24:107+0000',
                                    provider: null,
                                    email: 'amit93.kumar93@tarento.com',
                                    identifier: 'fd32bc48-8bf4-46f1-b3ae-55a45fa04281',
                                    thumbnail: null,

                                    aadhaarNo: '',
                                    avatar: null,
                                    userName: 'amit93.kumar93',
                                    rootOrgId: '32iu0e41972be9280f754e94',
                                    userId: 'fd32bc48-8bf4-46f1-b3ae-55a45fa04281',
                                    firstName: 'Amit',
                                    lastLoginTime: null,
                                    createdDate: '2017-07-08 12:52:43:730+0000',
                                    phone: '9900032121',
                                    dob: '1992-10-12',
                                    status: 1
                                },
                                {
                                    lastName: 'Kumar4',
                                    loginId: 'amit93.kumar93@null',

                                    gender: 'male',
                                    regOrgId: '32iu0e41972be9280f758999',
                                    subject: [
                                        'Physics',
                                        'Math',
                                        'English'
                                    ],
                                    roles: [
                                        'public'
                                    ],
                                    organisation: [],
                                    language: [
                                        'English',
                                        'Hindi'
                                    ],
                                    updatedDate: '2017-07-08 12:56:24:107+0000',
                                    provider: null,
                                    email: 'amit93.kumar93@tarento.com',
                                    identifier: 'fd32bc48-8bf4-46f1-b3ae-55a45fa04281',
                                    thumbnail: null,

                                    aadhaarNo: '',
                                    avatar: null,
                                    userName: 'amit93.kumar93',
                                    rootOrgId: '32iu0e41972be9280f754e94',
                                    userId: '4fd32bc48-8bf4-46f1-b3ae-55a45fa04281',
                                    firstName: 'Amit2',
                                    lastLoginTime: null,
                                    createdDate: '2017-07-08 12:52:43:730+0000',
                                    phone: '9900032121',
                                    dob: '1992-10-12',
                                    status: 1
                                }, {
                                    lastName: 'Kumar3',
                                    loginId: 'amit93.kumar93@null',

                                    gender: 'male',
                                    regOrgId: '32iu0e41972be9280f758999',
                                    subject: [
                                        'Physics',
                                        'Math',
                                        'English'
                                    ],
                                    roles: [
                                        'public'
                                    ],
                                    organisation: [],
                                    language: [
                                        'English',
                                        'Hindi'
                                    ],
                                    updatedDate: '2017-07-08 12:56:24:107+0000',
                                    provider: null,
                                    email: 'amit93.kumar93@tarento.com',
                                    identifier: 'fd32bc48-8bf4-46f1-b3ae-55a45fa04281',
                                    thumbnail: null,

                                    aadhaarNo: '',
                                    avatar: null,
                                    userName: 'amit93.kumar93',
                                    rootOrgId: '32iu0e41972be9280f754e94',
                                    userId: 'fd32bc48-8bf4-46f1-b3ae-55a45fa04281',
                                    firstName: 'Amit',
                                    lastLoginTime: null,
                                    createdDate: '2017-07-08 12:52:43:730+0000',
                                    phone: '9900032121',
                                    dob: '1992-10-12',
                                    status: 1
                                }, {
                                    lastName: 'Kumar5',
                                    loginId: 'amit93.kumar93@null',

                                    gender: 'male',
                                    regOrgId: '32iu0e41972be9280f758999',
                                    subject: [
                                        'Physics',
                                        'Math',
                                        'English'
                                    ],
                                    roles: [
                                        'public'
                                    ],
                                    organisation: [],
                                    language: [
                                        'English',
                                        'Hindi'
                                    ],
                                    updatedDate: '2017-07-08 12:56:24:107+0000',
                                    provider: null,
                                    email: 'amit93.kumar93@tarento.com',
                                    identifier: '5fd32bc48-8bf4-46f1-b3ae-55a45fa04281',
                                    thumbnail: null,

                                    aadhaarNo: '',
                                    avatar: null,
                                    userName: 'amit93.kumar93',
                                    rootOrgId: '32iu0e41972be9280f754e94',
                                    userId: '3fd32bc48-8bf4-46f1-b3ae-55a45fa04281',
                                    firstName: 'Amit5',
                                    lastLoginTime: null,
                                    createdDate: '2017-07-08 12:52:43:730+0000',
                                    phone: '9900032121',
                                    dob: '1992-10-12',
                                    status: 1
                                }
                            ]
                        }
                    }
                };

                var deferred = $q.defer();
                deferred.resolve(res);
                // return deferred.promise;
                // return httpServiceJava.get(url, req);
            };

            this.deleteUser = function (req) {
                // var url = config.URL.LEARNER_PREFIX + config.URL.ADMIN.USER_SEARCH;
                var res = {
                    id: null,
                    ver: 'v1',
                    ts: '2017-08-01 15:30:29:857+0530',
                    params: {
                        resmsgid: null,
                        msgid: '417ba640-d1e1-49f8-bb65-d10f8868b524',
                        err: null,
                        status: 'success',
                        errmsg: null
                    },
                    responseCode: 'OK',
                    result: {
                        response: 'SUCCESS'
                    }
                };
                var deferred = $q.defer();
                deferred.resolve(res);
                // return deferred.promise;
                // return httpServiceJava.get(url, req);
            };
        }]);
