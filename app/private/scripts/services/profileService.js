'use strict';
angular.module('playerApp')
    .service('profileService', function(javaService, config, $q, $sessionStorage, $rootScope, $state, $cookies, $window) {
        this.getUserProfile = function(uId) {
            var url = config.URL.LEARNER_PREFIX + config.URL.AUTH.PROFILE + '/:' + uId;
            // return javaService.get(url);
            var deferred = $q.defer();
            var userdata = {
                'id': 'sunbird.user.profile',
                'ver': '1.0',
                'ts': '2017-05-13T10:50:15:186+0530',
                'params': {
                    'resmsgid': '7c27cbf5-e299-43b0-bca7-8347f7e5abcf',
                    'msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
                    'err': null,
                    'status': 'success',
                    'errmsg': null
                },
                'responseCode': 'OK',
                'result': {
                    'profile': {
                        'id': 'e9280b815c0e41972bf754e94',
                        'firstName': 'Mohan',
                        'lastName': 'Kumar',
                        'email': 'mohan.kumar@invalid121email.com',
                        'phone': '9900032121',
                        'gender': 'male',
                        'rootOrgId': '32iu0e41972be9280f754e94',
                        'avatar': 'https://placeholdit.co//i/555x500',
                        'thumbnail': null,
                        'dob': '1992-10-12',
                        'address': [{
                            'id': 'b815c0e41972be9280f754e94',
                            'addType': 'permanent',
                            'addressLine1': '212 winding hill dr',
                            'addressLine2': 'Frazer town',
                            'city': 'Bangalore',
                            'state': 'Karnataka',
                            'zipCode': '560103'
                        }],
                        'summary': 'Dedicated, ambitious and goal-driven educator with 3 years’ progressive experience in high school settings. Documented success in providing activities and materials that engage and develop the students intellectually. Thorough understanding of implementing the use of information technology in lesson preparation.',
                        'education': [{
                                'id': '4e94972be9280f75b815c0e41',
                                'degree': 'Bachelor of Science',
                                'yearOfPassing': 2012,
                                'percentage': 72.5,
                                'grade': 'B',
                                'name': 'MG College',
                                'boardOrUniversity': 'Anna University'
                            },
                            {
                                'id': '0f75b972b4e94e928815c0e41',
                                'degree': 'Plus 2',
                                'yearOfPassing': 2009,
                                'percentage': 74,
                                'name': 'Delhi Public School',
                                'boardOrUniversity': 'CBSE'
                            }
                        ],
                        'organisations': [{
                            'orgId': 'b815c0e41972be9280f754e94',
                            'role': 'CONTENT_REVIEWER',
                            'name': 'TNSCERT',
                            'rootOrgId': '32iu0e41972be9280f754e94'
                        }]
                    }
                }
            };
            deferred.resolve(userdata);
            return deferred.promise;
        };
    });