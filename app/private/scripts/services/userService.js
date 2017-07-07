'use strict';

/**
 * @ngdoc service
 * @name playerApp.userService
 * @description
 * # userService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('userService', function(config, httpService, httpServiceJava, $q) {
        this.resourceBundle = function(language, type) {
            var url = config.URL.CONFIG_BASE + config.URL.USER.RESOURCE_BUNDLE + '/' + type + '/' + language;
            return httpService.get(url);
        };

        this.getUserProfile = function(uId) {
            var url = config.URL.LEARNER_PREFIX + config.URL.USER.GET_PROFILE + '/' + uId;
            return httpServiceJava.get(url);
            // var deferred = $q.defer();
            // var profileData = {
            //     'responseCode': 'OK',
            //     'params': {},
            //     'result': {
            //         'response': [{
            //             'firstName': 'Amit',
            //             'lastName': 'Kumar',
            //             'password': 'password',
            //             'email': 'amit2.kumar2@tarento.com',
            //             'userName': 'amit2.kumar2',
            //             'phone': '9900032121',
            //             'gender': 'male',
            //             'rootOrgId': '32iu0e41972be9280f754e94',
            //             'regOrgId': '32iu0e41972be9280f758999',
            //             'avatar': null,
            //             'dob': '1992-10-12',
            //             'aadhaarNo': '',
            //             'language': ['English', 'Hindi'],
            //             'subject': ['Physics', 'Math', 'English'],
            //             'address': [{
            //                     'addType': 'permanent',
            //                     'addressLine1': '212 winding hill dr',
            //                     'addressLine2': 'Frazer town',
            //                     'city': 'Bangalore',
            //                     'state': 'Karnataka',
            //                     'zipCode': '560103'
            //                 },
            //                 {
            //                     'addType': 'permanent1',
            //                     'addressLine1': '2121 winding hill dr',
            //                     'addressLine2': 'Frazer town1',
            //                     'city': 'Bangalore1',
            //                     'state': 'Karnataka1',
            //                     'zipCode': '560135'
            //                 }
            //             ],
            //             'education': [{
            //                     'degree': 'Bachelor of Science',
            //                     'yearOfPassing': 2012,
            //                     'percentage': 72.5,
            //                     'grade': 'B',
            //                     'name': 'MG College',
            //                     'boardOrUniversity': 'Anna University',
            //                     'address': {
            //                         'addressLine1': '2121 winding hill dr',
            //                         'addressLine2': 'Frazer town1',
            //                         'city': 'Bangalore1',
            //                         'state': 'Karnataka1',
            //                         'zipCode': '560135'
            //                     }
            //                 },
            //                 {
            //                     'degree': 'Plus 2',
            //                     'yearOfPassing': 2009,

            //                     'name': 'Delhi Public School',
            //                     'boardOrUniversity': 'CBSE',
            //                     'address': {
            //                         'addressLine1': '2121 winding hill dr',
            //                         'addressLine2': 'Frazer town1',
            //                         'city': 'Bangalore1',
            //                         'state': 'Karnataka1',
            //                         'zipCode': '560135'
            //                     }
            //                 }
            //             ],
            //             'jobProfile': [{
            //                     'jobName': 'jobName',
            //                     'role': 'teacher',
            //                     'joiningDate': '1992-10-12',
            //                     'endDate': '1992-10-12',
            //                     'orgId': '123',
            //                     'orgName': 'AP ORG',
            //                     'subject': ['Physics', 'Chemistry'],

            //                     'address': {
            //                         'addressLine1': '2121 winding hill dr',
            //                         'addressLine2': 'Frazer town1',
            //                         'city': 'Bangalore1',
            //                         'state': 'Karnataka1',
            //                         'zipCode': '560135'
            //                     }
            //                 },
            //                 {
            //                     'jobName': 'jobName2',
            //                     'role': 'teacher2',
            //                     'joiningDate': '1992-10-12',
            //                     'endDate': '1992-10-12',
            //                     'orgId': '123',
            //                     'orgName': 'AP ORG',
            //                     'subject': ['Physics', 'Chemistry'],

            //                     'address': {
            //                         'addressLine1': '2121 winding hill dr',
            //                         'addressLine2': 'Frazer town1',
            //                         'city': 'Bangalore1',
            //                         'state': 'Karnataka1',
            //                         'zipCode': '560135'
            //                     }
            //                 }
            //             ]
            //         }]
            //     }
            // };
            // deferred.resolve(profileData);
            // return deferred.promise;
        };
        this.updateUserProfile = function(req) {
            var url = config.URL.LEARNER_PREFIX + config.URL.USER.UPDATE_USER_PROFILE;
            return httpServiceJava.patch(url, req);
        };
    });