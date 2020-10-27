import { CollectionHierarchyAPI } from '@sunbird/core';	

export const CollectionHierarchyGetMockResponse = {	
    'id': 'ekstep.learning.content.hierarchy',	
    'ver': '2.0',	
    'ts': '2018-05-07T07:20:27ZZ',	
    'params': {	
        'resmsgid': '0ea98baa-5a9e-49fd-a568-7967bc1e0ab8',	
        'msgid': null,	
        'err': null,	
        'status': 'successful',	
        'errmsg': null	
    },	
    'responseCode': 'OK',	
    'result': {	
        'content': {	
            'downloadStatus': 'DOWNLOAD',	
            'code': 'org.ekstep.textbook.1498025274',	
            'notes': '',	
            'keywords': [	
                'numbers',	
                'math'	
            ],	
            'subject': 'Mathematics',	
            'channel': 'in.ekstep',	
            'description': 'Math',	
            'edition': '',	
            'language': [	
                'English'	
            ],	
            'mimeType': 'application/vnd.ekstep.content-collection',	
            'medium': 'English',	
            'idealScreenSize': 'normal',	
            'createdOn': '2017-06-21T06:09:37.770+0000',	
            'appIcon': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content	
          /do_112270512453271552134/artifact/61ebc74bd0eecff1011408d4aaa8790b_1497865290002.jpeg`,	
            'gradeLevel': [	
                'Class 4'	
            ],	
            'collections': [],	
            'children': [	
                {	
                    'pageNumber': '1',	
                    'code': 'org.ekstep.textbook.1498026396',	
                    'notes': '',	
                    'keywords': [	
                        'integers',	
                        'numbers'	
                    ],	
                    'channel': 'in.ekstep',	
                    'description': 'Numbers and Integers',	
                    'language': [	
                        'English'	
                    ],	
                    'mimeType': 'application/vnd.ekstep.content-collection',	
                    'idealScreenSize': 'normal',	
                    'createdOn': '2017-06-21T06:28:19.453+0000',	
                    'collections': [	
                        {	
                            'identifier': 'do_112271823894691840181',	
                            'name': 'Math for dummies',	
                            'objectType': 'Content',	
                            'relation': 'hasSequenceMember',	
                            'description': 'Math',	
                            'index': null,	
                            'status': null,	
                            'depth': null,	
                            'mimeType': null,	
                            'visibility': null,	
                            'compatibilityLevel': null	
                        }	
                    ],	
                    'children': [	
                        {	
                            'pageNumber': '',	
                            'code': 'org.ekstep.textbook.1498026431',	
                            'notes': '',	
                            'keywords': [	
                                'Numbers'	
                            ],	
                            'channel': 'in.ekstep',	
                            'description': 'Another unit',	
                            'language': [	
                                'English'	
                            ],	
                            'mimeType': 'application/vnd.ekstep.content-collection',	
                            'idealScreenSize': 'normal',	
                            'createdOn': '2017-06-21T06:28:54.300+0000',	
                            'collections': [	
                                {	
                                    'identifier': 'do_112271833083518976186',	
                                    'name': 'Numbers and Integers',	
                                    'objectType': 'Content',	
                                    'relation': 'hasSequenceMember',	
                                    'description': 'Numbers and Integers',	
                                    'index': null,	
                                    'status': null,	
                                    'depth': null,	
                                    'mimeType': null,	
                                    'visibility': null,	
                                    'compatibilityLevel': null	
                                }	
                            ],	
                            'children': [	
                                {	
                                    'channel': 'in.ekstep',	
                                    'downloadUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/	
                                  ecar_files/domain_44689_1463061499728.ecar`,	
                                    'language': [	
                                        'English'	
                                    ],	
                                    'source': 'EkStep',	
                                    'mimeType': 'application/vnd.ekstep.ecml-archive',	
                                    'gradeLevel': [	
                                        'Kindergarten'	
                                    ],	
                                    'collections': [	
                                        {	
                                            'identifier': 'do_11226278922323558419',	
                                            'name': 't1',	
                                            'objectType': 'Content',	
                                            'relation': 'hasSequenceMember',	
                                            'description': 't1',	
                                            'index': null,	
                                            'status': null,	
                                            'depth': null,	
                                            'mimeType': null,	
                                            'visibility': null,	
                                            'compatibilityLevel': null	
                                        },	
                                        {	
                                            'identifier': 'do_112261207346102272111',	
                                            'name': 'zfc',	
                                            'objectType': 'Content',	
                                            'relation': 'hasSequenceMember',	
                                            'description': 'sdafa',	
                                            'index': null,	
                                            'status': null,	
                                            'depth': null,	
                                            'mimeType': null,	
                                            'visibility': null,	
                                            'compatibilityLevel': null	
                                        },	
                                        {	
                                            'identifier': 'do_112260728555323392187',	
                                            'name': 'asdfsa',	
                                            'objectType': 'Content',	
                                            'relation': 'hasSequenceMember',	
                                            'description': 'asds',	
                                            'index': null,	
                                            'status': null,	
                                            'depth': null,	
                                            'mimeType': null,	
                                            'visibility': null,	
                                            'compatibilityLevel': null	
                                        },	
                                        {	
                                            'identifier': 'do_11226145546131865615',	
                                            'name': 'sad',	
                                            'objectType': 'Content',	
                                            'relation': 'hasSequenceMember',	
                                            'description': 'asd',	
                                            'index': null,	
                                            'status': null,	
                                            'depth': null,	
                                            'mimeType': null,	
                                            'visibility': null,	
                                            'compatibilityLevel': null	
                                        }	
                                    ],	
                                    'children': [],	
                                    'appId': 'ekstep_portal',	
                                    'usesContent': [],	
                                    'contentEncoding': 'gzip',	
                                    'artifactUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content	
                                  /1463061497846_domain_44689.zip`,	
                                    'sYS_INTERNAL_LAST_UPDATED_ON': '2017-06-09T05:23:52.630+0000',	
                                    'contentType': 'Story',	
                                    'item_sets': [],	
                                    'lastUpdatedBy': '387',	
                                    'identifier': 'domain_44689',	
                                    'audience': [	
                                        'Learner'	
                                    ],	
                                    'visibility': 'Default',	
                                    'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',	
                                    'portalOwner': 'EkStep',	
                                    'index': 2,	
                                    'mediaType': 'content',	
                                    'ageGroup': [	
                                        '5-6'	
                                    ],	
                                    'osId': 'org.ekstep.quiz.app',	
                                    'license': 'Creative Commons Attribution (CC BY)',	
                                    'size': 3394391,	
                                    'lastPublishedOn': '2016-05-12T13:58:20.311+0000',	
                                    'concepts': [],	
                                    'domain': [	
                                        'numeracy'	
                                    ],	
                                    'name': 'asd',	
                                    'publisher': 'EkStep',	
                                    'status': 'Retired',	
                                    'template': 'domain_38441',	
                                    'code': 'org.ekstep.numeracy.story.1201',	
                                    'methods': [],	
                                    'imageCredits': [	
                                        'ekstep'	
                                    ],	
                                    'description': 'zxc',	
                                    'lastFlaggedOn': '2017-06-29T10:16:57.774+0000',	
                                    'flaggedBy': [	
                                        '387'	
                                    ],	
                                    'idealScreenSize': 'normal',	
                                    'createdOn': '2017-09-12T09:13:13.397+0000',	
                                    'lastPublishDate': '2016-05-12T13:58:20.311+0000',	
                                    'contentDisposition': 'inline',	
                                    'lastUpdatedOn': '2017-08-24T06:38:25.124+0000',	
                                    'owner': 'EkStep',	
                                    'os': [	
                                        'All'	
                                    ],	
                                    'flagReasons': [	
                                        'Privacy violation'	
                                    ],	
                                    'soundCredits': [	
                                        'ekstep'	
                                    ],	
                                    'libraries': [],	
                                    'pkgVersion': 1,	
                                    'versionKey': '1503556705124',	
                                    'idealScreenDensity': 'hdpi',	
                                    's3Key': 'ecar_files/domain_44689_1463061499728.ecar',	
                                    'createdBy': 'EkStep',	
                                    'compatibilityLevel': 1,	
                                    'developer': 'EkStep'	
                                },	
                                {	
                                    'previewUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com	
                                  /content/ecml/do_112270494168555520130-latest`,	
                                    'subject': 'Mathematics',	
                                    'channel': 'in.ekstep',	
                                    'downloadUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com	
                                  /ecar_files/do_112270494168555520130/assessment-stats_1497863935009_do_112270494168555520130_1.0.ecar`,	
                                    'language': [	
                                        'English'	
                                    ],	
                                    'variants': {	
                                        'spine': {	
                                            'ecarUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com	
                                          /ecar_files/do_112270494168555520130/	
                                          assessment-stats_1497863935123_do_112270494168555520130_1.0_spine.ecar`,	
                                            'size': 40128	
                                        }	
                                    },	
                                    'source': '',	
                                    'mimeType': 'application/vnd.ekstep.ecml-archive',	
                                    'gradeLevel': [	
                                        'Grade 1',	
                                        'Grade 2'	
                                    ],	
                                    'appIcon': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_112270494168555520130	
                                  /artifact/fab2e7a6eb4386eea413fb0ac3042a33_1497608491799.thumb.jpeg`,	
                                    'collections': [	
                                        {	
                                            'identifier': 'do_112272631861288960132',	
                                            'name': 'Chapter 1.1',	
                                            'objectType': 'Content',	
                                            'relation': 'hasSequenceMember',	
                                            'description': 'geometry',	
                                            'index': null,	
                                            'status': null,	
                                            'depth': null,	
                                            'mimeType': null,	
                                            'visibility': null,	
                                            'compatibilityLevel': null	
                                        },	
                                        {	
                                            'identifier': 'do_112271833368985600187',	
                                            'name': 'Another unit',	
                                            'objectType': 'Content',	
                                            'relation': 'hasSequenceMember',	
                                            'description': 'Another unit',	
                                            'index': null,	
                                            'status': null,	
                                            'depth': null,	
                                            'mimeType': null,	
                                            'visibility': null,	
                                            'compatibilityLevel': null	
                                        },	
                                        {	
                                            'identifier': 'do_112233010611118080112',	
                                            'name': 'Place Value',	
                                            'objectType': 'Content',	
                                            'relation': 'hasSequenceMember',	
                                            'description': 'A number is formed by grouping the digits together',	
                                            'index': null,	
                                            'status': null,	
                                            'depth': null,	
                                            'mimeType': null,	
                                            'visibility': null,	
                                            'compatibilityLevel': null	
                                        },	
                                        {	
                                            'identifier': 'do_112272659156082688143',	
                                            'name': 'Chapter 2.1',	
                                            'objectType': 'Content',	
                                            'relation': 'hasSequenceMember',	
                                            'description': 'Chapter 2.1',	
                                            'index': null,	
                                            'status': null,	
                                            'depth': null,	
                                            'mimeType': null,	
                                            'visibility': null,	
                                            'compatibilityLevel': null	
                                        }	
                                    ],	
                                    'appId': 'dev.ekstep.in',	
                                    'contentEncoding': 'gzip',	
                                    'artifactUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content	
                                  /do_112270494168555520130/artifact/1497863933923_do_112270494168555520130.zip`,	
                                    'contentType': 'Story',	
                                    'sYS_INTERNAL_LAST_UPDATED_ON': '2017-06-19T09:18:55.667+0000',	
                                    'lastUpdatedBy': '412',	
                                    'identifier': 'do_112270494168555520130',	
                                    'audience': [	
                                        'Learner'	
                                    ],	
                                    'visibility': 'Default',	
                                    'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',	
                                    'index': 3,	
                                    'mediaType': 'content',	
                                    'ageGroup': [	
                                        '6-7',	
                                        '5-6'	
                                    ],	
                                    'osId': 'org.ekstep.quiz.app',	
                                    'lastPublishedBy': '181',	
                                    'prevState': 'Review',	
                                    'size': 157030,	
                                    'lastPublishedOn': '2017-06-19T09:18:55.007+0000',	
                                    'concepts': [	
                                        {	
                                            'identifier': 'C25',	
                                            'name': 'Money',	
                                            'objectType': 'Concept',	
                                            'relation': 'associatedTo',	
                                            'description': 'Money\r\nIdentify and convert money',	
                                            'index': null,	
                                            'status': null,	
                                            'depth': null,	
                                            'mimeType': null,	
                                            'visibility': null,	
                                            'compatibilityLevel': null	
                                        },	
                                        {	
                                            'identifier': 'C21',	
                                            'name': 'Length',	
                                            'objectType': 'Concept',	
                                            'relation': 'associatedTo',	
                                            'description': 'Length\nMeasurement with non standard metric',	
                                            'index': null,	
                                            'status': null,	
                                            'depth': null,	
                                            'mimeType': null,	
                                            'visibility': null,	
                                            'compatibilityLevel': null	
                                        }	
                                    ],	
                                    'domain': [	
                                        'numeracy'	
                                    ],	
                                    'name': 'Assessment stats',	
                                    'publisher': '',	
                                    'attributions': [	
                                        ''	
                                    ],	
                                    'status': 'Live',	
                                    'template': '',	
                                    'code': 'org.ekstep.numeracy.worksheet.5284',	
                                    'description': 'This is to test assessment data',	
                                    'lastFlaggedOn': '2017-06-20T09:38:14.435+0000',	
                                    'medium': 'English',	
                                    'flaggedBy': [	
                                        '412'	
                                    ],	
                                    'posterImage': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content	
                                  /do_1122684087626465281245/artifact/fab2e7a6eb4386eea413fb0ac3042a33_1497608491799.jpeg`,	
                                    'idealScreenSize': 'normal',	
                                    'createdOn': '2017-06-19T09:04:17.685+0000',	
                                    'contentDisposition': 'inline',	
                                    'lastUpdatedOn': '2017-06-20T10:33:22.180+0000',	
                                    'owner': 'Nidhi',	
                                    'creator': 'Nidhi Potdar',	
                                    'os': [	
                                        'All'	
                                    ],	
                                    'pkgVersion': 1,	
                                    'versionKey': '1497954802180',	
                                    'idealScreenDensity': 'hdpi',	
                                    's3Key': `ecar_files/do_112270494168555520130	
                                  /assessment-stats_1497863935009_do_112270494168555520130_1.0.ecar`,	
                                    'createdBy': '506',	
                                    'compatibilityLevel': 2	
                                }	
                            ],	
                            'appId': 'dev.ekstep.in',	
                            'contentDisposition': 'inline',	
                            'contentEncoding': 'gzip',	
                            'lastUpdatedOn': '2017-06-21T06:45:50.285+0000',	
                            'contentType': 'TextBookUnit',	
                            'identifier': 'do_112271833368985600187',	
                            'audience': [	
                                'Learner'	
                            ],	
                            'visibility': 'Parent',	
                            'os': [	
                                'All'	
                            ],	
                            'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',	
                            'index': 3,	
                            'mediaType': 'content',	
                            'osId': 'org.ekstep.quiz.app',	
                            'versionKey': '1498027550285',	
                            'tags': [	
                                'Numbers'	
                            ],	
                            'idealScreenDensity': 'hdpi',	
                            'framework': 'NCF',	
                            'concepts': [	
                                {	
                                    'identifier': 'C21',	
                                    'name': 'Length',	
                                    'objectType': 'Concept',	
                                    'relation': 'associatedTo',	
                                    'description': 'Length\nMeasurement with non standard metric, ',	
                                    'index': null,	
                                    'status': null,	
                                    'depth': null,	
                                    'mimeType': null,	
                                    'visibility': null,	
                                    'compatibilityLevel': null	
                                }	
                            ],	
                            'compatibilityLevel': 1,	
                            'name': 'Another unit',	
                            'status': 'Draft'	
                        }	
                    ],	
                    'appId': 'dev.ekstep.in',	
                    'contentDisposition': 'inline',	
                    'contentEncoding': 'gzip',	
                    'lastUpdatedOn': '2017-06-21T06:45:49.113+0000',	
                    'contentType': 'TextBookUnit',	
                    'identifier': 'do_112271833083518976186',	
                    'audience': [	
                        'Learner'	
                    ],	
                    'visibility': 'Parent',	
                    'os': [	
                        'All'	
                    ],	
                    'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',	
                    'index': 1,	
                    'mediaType': 'content',	
                    'osId': 'org.ekstep.quiz.app',	
                    'versionKey': '1498027549113',	
                    'tags': [	
                        'integers',	
                        'numbers'	
                    ],	
                    'idealScreenDensity': 'hdpi',	
                    'framework': 'NCF',	
                    'concepts': [	
                        {	
                            'identifier': 'C21',	
                            'name': 'Length',	
                            'objectType': 'Concept',	
                            'relation': 'associatedTo',	
                            'description': 'Length\nMeasurement with non standard metric, ',	
                            'index': null,	
                            'status': null,	
                            'depth': null,	
                            'mimeType': null,	
                            'visibility': null,	
                            'compatibilityLevel': null	
                        }	
                    ],	
                    'compatibilityLevel': 1,	
                    'name': 'Numbers and Integers',	
                    'status': 'Draft'	
                }	
            ],	
            'appId': 'dev.ekstep.in',	
            'publication': 'ekstep',	
            'contentDisposition': 'inline',	
            'contentEncoding': 'gzip',	
            'lastUpdatedOn': '2017-06-21T06:45:49.839+0000',	
            'contentType': 'TextBook',	
            'owner': 'Sunil',	
            'lastUpdatedBy': '398',	
            'identifier': 'do_112271823894691840181',	
            'audience': [	
                'Instructor'	
            ],	
            'visibility': 'Default',	
            'os': [	
                'All'	
            ],	
            'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',	
            'mediaType': 'content',	
            'osId': 'org.ekstep.quiz.app',	
            'versionKey': '1498027549839',	
            'tags': [	
                'numbers',	
                'math'	
            ],	
            'idealScreenDensity': 'hdpi',	
            'framework': 'NCF',	
            'createdBy': '398',	
            'compatibilityLevel': 1,	
            'name': 'Math for dummies',	
            'usedByContent': [],	
            'board': 'NCERT',	
            'status': 'Draft'	
        }	
    }	
};	


export const collectionTree = {	

    'data': {	
    'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',	

        },	
        'mimeType': 'application/vnd.ekstep.content-collection',	
        // tslint:disable-next-line:max-line-length	
        'appIcon': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_1125110672521134081296/artifact/62f05664348aeff61aa195d0dc3caba5_1527228627157.thumb.jpg',	
        'gradeLevel': [	
            'Class 4'	
        ],	
        'children': [	
            {	
                'code': 'do_1125110676518584321298',	
                // tslint:disable-next-line:max-line-length	
                'downloadUrl': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/do_1125110676518584321298/untitled-course-unit_1527230368465_do_1125110676518584321298_1.0_spine.ecar',	
                'language': [	
                    'English'	
                ],	
                'variants': {	
                    'spine': {	
                        // tslint:disable-next-line:max-line-length	
                        'ecarUrl': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/do_1125110676518584321298/untitled-course-unit_1527230368465_do_1125110676518584321298_1.0_spine.ecar',	
                        'size': 68729	
                    }	
                },	
                'mimeType': 'application/vnd.ekstep.content-collection',	
                'idealScreenSize': 'normal',	
                'createdOn': '2018-05-25T06:32:17.971+0000',	
                'children': [	
                    {	
                        'previewUrl': 'http://www.dailymotion.com/video/x175su1',	
                        'subject': 'English',	
                        // tslint:disable-next-line:max-line-length	
                        'downloadUrl': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/do_1125110622654464001294/a5-ext-link_1527765793788_do_1125110622654464001294_2.0.ecar',	
                        'channel': '505c7c48ac6dc1edc9b08f21db5a571d',	
                        'showNotification': true,	
                        'language': [	
                            'English'	
                        ],	
                        'variants': {	
                            'spine': {	
                                // tslint:disable-next-line:max-line-length	
                                'ecarUrl': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/do_1125110622654464001294/a5-ext-link_1527765793872_do_1125110622654464001294_2.0_spine.ecar',	
                                'size': 68484	
                            }	
                        },	
                        'mimeType': 'text/x-url',	
                        'gradeLevel': [	
                            'Class 1'	
                        ],	
                        // tslint:disable-next-line:max-line-length	
                        'appIcon': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_1125110622654464001294/artifact/62f05664348aeff61aa195d0dc3caba5_1527228627157.thumb.jpg',	
                        'appId': 'dev.sunbird.portal',	
                        'artifactUrl': 'http://www.dailymotion.com/video/x175su1',	
                        'contentEncoding': 'identity',	
                        'sYS_INTERNAL_LAST_UPDATED_ON': '2018-05-31T11:23:14.033+0000',	
                        'contentType': 'Resource',	
                        'lastUpdatedBy': '3b34c469-460b-4c20-8756-c5fce2de9e69',	
                        'identifier': 'do_1125110622654464001294',	
                        'audience': [	
                            'Learner'	
                        ],	
                        'visibility': 'Default',	
                        'consumerId': '72e54829-6402-4cf0-888e-9b30733c1b88',	
                        'index': 1,	
                        'mediaType': 'content',	
                        'osId': 'org.ekstep.quiz.app',	
                        'lastPublishedBy': '3b34c469-460b-4c20-8756-c5fce2de9e69',	
                        'prevState': 'Live',	
                        'lastPublishedOn': '2018-05-31T11:23:13.788+0000',	
                        'size': 68484,	
                        'concepts': [	
                            {	
                                'identifier': 'SC7',	
                                'name': 'Earth',	
                                'objectType': 'Concept',	
                                'relation': 'associatedTo',	
                                'description': 'Earth',	
                                'index': null,	
                                'status': null,	
                                'depth': null,	
                                'mimeType': null,	
                                'visibility': null,	
                                'compatibilityLevel': null	
                            }	
                        ],	
                        'name': 'A5 ext link',	
                        'status': 'Live',	
                        'code': 'a5392316-994b-456c-b14b-2d11316c843a',	
                        'medium': 'Hindi',	
                        // tslint:disable-next-line:max-line-length	
                        'posterImage': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_1125110569107128321291/artifact/62f05664348aeff61aa195d0dc3caba5_1527228627157.jpg',	
                        'idealScreenSize': 'normal',	
                        'createdOn': '2018-05-25T06:21:20.450+0000',	
                        'contentDisposition': 'online',	
                        'lastUpdatedOn': '2018-05-31T11:23:13.620+0000',	
                        'creator': 'sunbird Test',	
                        'createdFor': [	
                            'ORG_001'	
                        ],	
                        'os': [	
                            'All'	
                        ],	
                        'pkgVersion': 2,	
                        'versionKey': '1527765793620',	
                        'idealScreenDensity': 'hdpi',	
                        's3Key': 'ecar_files/do_1125110622654464001294/a5-ext-link_1527765793788_do_1125110622654464001294_2.0.ecar',	
                        'framework': 'NCF',	
                        'lastSubmittedOn': '2018-05-25T06:22:18.386+0000',	
                        'createdBy': '63b0870c-f370-4f96-842d-f6a7fa2db1df',	
                        'compatibilityLevel': 4,	
                        'board': 'CBSE',	
                        'resourceType': 'Practice'	
                    }	
                ],	
                'contentDisposition': 'inline',	
                'contentEncoding': 'gzip',	
                'lastUpdatedOn': '2018-05-25T06:37:47.881+0000',	
                'sYS_INTERNAL_LAST_UPDATED_ON': '2018-05-25T06:39:28.728+0000',	
                'contentType': 'CourseUnit',	
                'identifier': 'do_1125110676518584321298',	
                'audience': [	
                    'Learner'	
                ],	
                'visibility': 'Parent',	
                'os': [	
                    'All'	
                ],	
                'index': 1,	
                'mediaType': 'content',	
                'osId': 'org.ekstep.launcher',	
                'pkgVersion': 1,	
                'versionKey': '1527229937971',	
                'idealScreenDensity': 'hdpi',	
                's3Key': 'ecar_files/do_1125110676518584321298/untitled-course-unit_1527230368465_do_1125110676518584321298_1.0_spine.ecar',	
                'size': 68729,	
                'lastPublishedOn': '2018-05-25T06:39:28.461+0000',	
                'compatibilityLevel': 4,	
                'name': 'Untitled Course Unit',	
                'status': 'Live'	
            }	
        ],	
        'appId': 'ekstep_portal',	
        'contentEncoding': 'gzip',	
        'mimeTypesCount': '{"text/x-url":1,"application/vnd.ekstep.content-collection":1}',	
        'contentType': 'Course',	
        'sYS_INTERNAL_LAST_UPDATED_ON': '2018-06-27T08:00:03.690+0000',	
        'lastUpdatedBy': '3b34c469-460b-4c20-8756-c5fce2de9e69',	
        'identifier': 'do_1125110672521134081296',	
        'audience': [	
            'Learner'	
        ],	
        // tslint:disable-next-line:max-line-length	
        'toc_url': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_1125110672521134081296/artifact/do_1125110672521134081296toc.json',	
        'visibility': 'Default',	
        'contentTypesCount': '{"CourseUnit":1,"Resource":1}',	
        'childNodes': [	
            'do_1125110622654464001294',	
            'do_1125110676518584321298'	
        ],	
        'consumerId': '72e54829-6402-4cf0-888e-9b30733c1b88',	
        'mediaType': 'content',	
        'osId': 'org.ekstep.quiz.app',	
        'lastPublishedBy': '3b34c469-460b-4c20-8756-c5fce2de9e69',	
        'prevState': 'Review',	
        'size': 136330,	
        'lastPublishedOn': '2018-05-25T06:39:28.869+0000',	
        'name': 'A5 ext course',	
        'status': 'Live',	
        'code': 'org.sunbird.jWP6eG',	
        'medium': 'Hindi',	
        // tslint:disable-next-line:max-line-length	
        'posterImage': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_1125110569107128321291/artifact/62f05664348aeff61aa195d0dc3caba5_1527228627157.jpg',	
        'idealScreenSize': 'normal',	
        'createdOn': '2018-05-25T06:31:29.174+0000',	
        'contentDisposition': 'inline',	
        'lastUpdatedOn': '2018-05-25T06:39:28.401+0000',	
        'c_Sunbird_Dev_open_batch_count': 1,	
        'creator': 'sunbird Test',	
        'createdFor': [	
            'ORG_001'	
        ],	
        'os': [	
            'All'	
        ],	
        'pkgVersion': 1,	
        'versionKey': '1527230368401',	
        'idealScreenDensity': 'hdpi',	
        's3Key': 'ecar_files/do_1125110672521134081296/a5-ext-course_1527230368908_do_1125110672521134081296_1.0_spine.ecar',	
        'framework': 'NCF',	
        'lastSubmittedOn': '2018-05-25T06:37:48.439+0000',	
        'createdBy': '63b0870c-f370-4f96-842d-f6a7fa2db1df',	
        'leafNodesCount': 1,	
        'compatibilityLevel': 4,	
        'c_Sunbird_Dev_private_batch_count': 2,	
        'board': 'CBSE'	
    };	

export const telemetryErrorData = {	
    'context': {	
        'env': 'get'	
    },	
    'object': {	
        'id': undefined,	
        'type': '',	
        'ver': '1.0'	
    },	
    'edata': {	
        'err': '',	
        'errtype': 'SYSTEM',	
        'stacktrace': '{"message":"contentType field not available","type":"edit","pageid":"get","subtype":"paginate"}'	
    }	
};