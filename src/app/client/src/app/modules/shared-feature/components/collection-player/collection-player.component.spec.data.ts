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

export const requiredProperties = {
    'mimeType': 'application/vnd.ekstep.content-collection',
    'children': [
      {
        'mimeType': 'application/vnd.ekstep.content-collection',
        'children': [
          {
            'mimeType': 'text/x-url',
            'contentType': 'Resource',
            'identifier': 'do_1125110622654464001294',
            'visibility': 'Default',
            'name': 'A5 ext link'
          }
        ],
        'contentType': 'CourseUnit',
        'identifier': 'do_1125110676518584321298',
        'visibility': 'Parent',
        'name': 'Untitled Course Unit'
      }
    ],
    'contentType': 'Course',
    'identifier': 'do_1125110672521134081296',
    'visibility': 'Default',
    'name': 'A5 ext course'
};

export const contentHeaderData = {
    downloadList:
    {
        'id': 'api.content.download.list',
        'ver': '1.0',
        'ts': '2020-01-09T09:36:46.405Z',
        'params': {
            'resmsgid': '3580f558-7f76-4fc2-8b8a-4c568f321e27',
            'msgid': '7669e658-9248-459c-be11-c9f83efc9e1a',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'contents': [
                    {
                        'id': '264c47da-2436-4652-9214-b89ad11778f0',
                        'contentId': 'do_31276385539644620815652',
                        'identifier': 'do_31276385539644620815652',
                        'resourceId': 'do_31275241153060864018150',
                        'mimeType': 'application/vnd.ekstep.content-collection',
                        'name': '10 ವಿಜ್ಞಾನ ಭಾಗ 2',
                        'status': 'completed',
                        'createdOn': 1578562459472,
                        'pkgVersion': 3,
                        'contentType': 'TextBook',
                        'addedUsing': 'download'
                    }
                ]
            }
        }
    },
    collectionData : {
        'id': 'api.course.hierarchy',
        'ver': '1.0',
        'ts': '2020-01-10T06:02:18.087Z',
        'params': {
            'resmsgid': 'c1e85770-336e-11ea-9761-03f00e501b7f',
            'msgid': 'fafe06ce-c943-dd1f-a7c1-bd6601c5fba4',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'content': {
                'keywords': [
                    'LFW',
                    'Story'
                ],
                'subject': 'English',
                'channel': '505c7c48ac6dc1edc9b08f21db5a571d',
                // tslint:disable-next-line: max-line-length
                'downloadUrl': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3123405048187617282365/attippttai-vaacippu_1506426300521_do_3123405048187617282365_3.0.ecar',
                'language': [
                    'Tamil'
                ],
                'variants': {
                    'spine': {
                        // tslint:disable-next-line: max-line-length
                        'ecarUrl': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3123405048187617282365/attippttai-vaacippu_1506426301631_do_3123405048187617282365_3.0_spine.ecar',
                        'size': 88377
                    }
                },
                'mimeType': 'application/vnd.ekstep.content-collection',
                'gradeLevel': [
                    'Other'
                ],
                // tslint:disable-next-line: max-line-length
                'appIcon': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_3123405048187617282365/artifact/reading_1491392171063.thumb.png',
                'children': [
                    {
                        // tslint:disable-next-line: max-line-length
                        'previewUrl': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/ecml/do_3123361417003663362549-latest',
                        'keywords': [
                            'LFW'
                        ],
                        'subject': 'English',
                        'channel': 'in.ekstep',
                        // tslint:disable-next-line: max-line-length
                        'downloadUrl': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3123361417003663362549/meyyellluttukkllinnn-oli-paakm-1_1506423864879_do_3123361417003663362549_3.0.ecar',
                        'language': [
                            'Tamil'
                        ],
                        'variants': {
                            'spine': {
                                // tslint:disable-next-line: max-line-length
                                'ecarUrl': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3123361417003663362549/meyyellluttukkllinnn-oli-paakm-1_1506423865269_do_3123361417003663362549_3.0_spine.ecar',
                                'size': 7069
                            }
                        },
                        'source': '',
                        'mimeType': 'application/vnd.ekstep.ecml-archive',
                        'gradeLevel': [
                            'Other'
                        ],
                        // tslint:disable-next-line: max-line-length
                        'appIcon': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_31225577063385497622350/artifact/ed0871597c0dd7845e711fd225fd57f2_1496065700362.jpeg',
                        'copyType': 'Enhance',
                        'collaborators': [
                            '244',
                            '2511',
                            '2918'
                        ],
                        // tslint:disable-next-line: max-line-length
                        'artifactUrl': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_3123361417003663362549/artifact/1506423864439_do_3123361417003663362549.zip',
                        'contentEncoding': 'gzip',
                        'contentType': 'Resource',
                        'sYS_INTERNAL_LAST_UPDATED_ON': '2017-09-26T11:04:25.506+0000',
                        'lastUpdatedBy': '587',
                        'identifier': 'do_3123361417003663362549',
                        'audience': [
                            'Learner'
                        ],
                        'visibility': 'Default',
                        'consumerId': '62e15662-bb09-439f-86e2-d65bd84f3c23',
                        'index': 2,
                        'mediaType': 'content',
                        'osId': 'org.ekstep.quiz.app',
                        'ageGroup': [
                            'Other'
                        ],
                        'lastPublishedBy': '587',
                        'languageCode': 'mr',
                        'tags': [
                            'LFW'
                        ],
                        'size': 5530239,
                        'lastPublishedOn': '2017-09-26T11:04:24.879+0000',
                        'concepts': [
                            {
                                'identifier': 'LO16',
                                'name': 'Onset-Coda Awareness',
                                'objectType': 'Concept',
                                'relation': 'associatedTo',
                                'description': 'Onset-Coda Awareness',
                                'index': null,
                                'status': null,
                                'depth': null,
                                'mimeType': null,
                                'visibility': null,
                                'compatibilityLevel': null
                            },
                            {
                                'identifier': 'LO17',
                                'name': 'Memory For Sound Strings',
                                'objectType': 'Concept',
                                'relation': 'associatedTo',
                                'description': 'Memory For Sound Strings',
                                'index': null,
                                'status': null,
                                'depth': null,
                                'mimeType': null,
                                'visibility': null,
                                'compatibilityLevel': null
                            },
                            {
                                'identifier': 'LO12',
                                'name': 'Phoneme Awareness',
                                'objectType': 'Concept',
                                'relation': 'associatedTo',
                                'description': 'Phoneme Awareness',
                                'index': null,
                                'status': null,
                                'depth': null,
                                'mimeType': null,
                                'visibility': null,
                                'compatibilityLevel': null
                            },
                            {
                                'identifier': 'LO14',
                                'name': 'Syllable Awareness',
                                'objectType': 'Concept',
                                'relation': 'associatedTo',
                                'description': 'Syllable Awareness',
                                'index': null,
                                'status': null,
                                'depth': null,
                                'mimeType': null,
                                'visibility': null,
                                'compatibilityLevel': null
                            }
                        ],
                        'domain': [
                            'literacy'
                        ],
                        'name': 'மெய்யெழுத்துக்களின் ஒலி (பாகம் - 1)',
                        'publisher': '',
                        'attributions': [
                            ''
                        ],
                        'status': 'Live',
                        'template': '',
                        'code': 'org.ekstep.literacy.story.8627.fork.323.1505876483',
                        'origin': 'do_31225786094437171212832',
                        'description': 'இந்த பாகத்தில் மெய் எழுத்துக்களை எப்படி உச்சரிப்பது என்று பயில்வீர்கள்.',
                        'idealScreenSize': 'normal',
                        'createdOn': '2017-09-26T07:06:05.279+0000',
                        'contentDisposition': 'inline',
                        'lastUpdatedOn': '2017-09-26T11:11:36.493+0000',
                        'owner': 'LeapForWord',
                        'createdFor': [
                            ''
                        ],
                        'creator': 'Paluru Abhign Sai (EkStep)',
                        'os': [
                            'All'
                        ],
                        'pkgVersion': 3,
                        'versionKey': '1506423865506',
                        'idealScreenDensity': 'hdpi',
                        'framework': 'NCF',
                        // tslint:disable-next-line: max-line-length
                        's3Key': 'ecar_files/do_3123361417003663362549/meyyellluttukkllinnn-oli-paakm-1_1506423864879_do_3123361417003663362549_3.0.ecar',
                        'lastSubmittedOn': '2017-09-26T11:02:29.813+0000',
                        'createdBy': '323',
                        'compatibilityLevel': 2,
                        'organization': [
                            ''
                        ],
                        'board': 'Other',
                        'resourceType': 'Learn'
                    },
                    {
                        'copyright': '',
                        // tslint:disable-next-line: max-line-length
                        'previewUrl': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/ecml/do_31225698054253772812594-latest',
                        'keywords': [
                            'LFW'
                        ],
                        'subject': 'English',
                        'channel': 'in.ekstep',
                        // tslint:disable-next-line: max-line-length
                        'downloadUrl': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_31225698054253772812594/1.5-vkupprrai-pyirrccikll-classroom-activities-ert_1506404806553_do_31225698054253772812594_6.0.ecar',
                        'language': [
                            'Tamil'
                        ],
                        'variants': {
                            'spine': {
                                // tslint:disable-next-line: max-line-length
                                'ecarUrl': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_31225698054253772812594/1.5-vkupprrai-pyirrccikll-classroom-activities-ert_1506404807027_do_31225698054253772812594_6.0_spine.ecar',
                                'size': 7559
                            }
                        },
                        'mimeType': 'application/vnd.ekstep.ecml-archive',
                        'source': '',
                        'gradeLevel': [
                            'Other'
                        ],
                        // tslint:disable-next-line: max-line-length
                        'appIcon': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_31225705680633036812652/artifact/238c913bdf34c7563b4b4e144ed1f0a5_1496222805834.jpeg',
                        'me_totalTimespent': 8501.46,
                        'me_averageTimespentPerSession': 26.73,
                        'me_totalRatings': 0,
                        'copyType': 'Enhance',
                        'contentEncoding': 'gzip',
                        'collaborators': [
                            '323',
                            '244'
                        ],
                        // tslint:disable-next-line: max-line-length
                        'artifactUrl': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_31225698054253772812594/artifact/1506403054422_do_31225698054253772812594.zip',
                        'contentType': 'Resource',
                        'sYS_INTERNAL_LAST_UPDATED_ON': '2017-09-26T05:46:47.156+0000',
                        'lastUpdatedBy': '587',
                        'identifier': 'do_31225698054253772812594',
                        'audience': [
                            'Instructor'
                        ],
                        'visibility': 'Default',
                        'portalOwner': '1224',
                        'index': 3,
                        'mediaType': 'content',
                        'osId': 'org.ekstep.quiz.app',
                        'ageGroup': [
                            'Other'
                        ],
                        'lastPublishedBy': '587',
                        'languageCode': 'mr',
                        'tags': [
                            'LFW'
                        ],
                        'prevState': 'Review',
                        'size': 5771212,
                        'lastPublishedOn': '2017-09-26T05:46:46.553+0000',
                        'concepts': [
                            {
                                'identifier': 'LO14',
                                'name': 'Syllable Awareness',
                                'objectType': 'Concept',
                                'relation': 'associatedTo',
                                'description': 'Syllable Awareness',
                                'index': null,
                                'status': null,
                                'depth': null,
                                'mimeType': null,
                                'visibility': null,
                                'compatibilityLevel': null
                            },
                            {
                                'identifier': 'LO16',
                                'name': 'Onset-Coda Awareness',
                                'objectType': 'Concept',
                                'relation': 'associatedTo',
                                'description': 'Onset-Coda Awareness',
                                'index': null,
                                'status': null,
                                'depth': null,
                                'mimeType': null,
                                'visibility': null,
                                'compatibilityLevel': null
                            },
                            {
                                'identifier': 'LO12',
                                'name': 'Phoneme Awareness',
                                'objectType': 'Concept',
                                'relation': 'associatedTo',
                                'description': 'Phoneme Awareness',
                                'index': null,
                                'status': null,
                                'depth': null,
                                'mimeType': null,
                                'visibility': null,
                                'compatibilityLevel': null
                            },
                            {
                                'identifier': 'LO17',
                                'name': 'Memory For Sound Strings',
                                'objectType': 'Concept',
                                'relation': 'associatedTo',
                                'description': 'Memory For Sound Strings',
                                'index': null,
                                'status': null,
                                'depth': null,
                                'mimeType': null,
                                'visibility': null,
                                'compatibilityLevel': null
                            }
                        ],
                        'domain': [
                            'literacy'
                        ],
                        'me_averageSessionsPerDevice': 1.99,
                        'name': '1.5 வகுப்பறை பயிற்ச்சிகள் (Classroom Activities) (ERT)',
                        'publisher': '',
                        'attributions': [
                            ''
                        ],
                        'status': 'Live',
                        'template': '',
                        'me_averageInteractionsPerMin': 7.93,
                        'code': 'org.ekstep.literacy.story.8627.fork.fork.fork.fork',
                        'me_totalSessionsCount': 318,
                        'origin': 'do_31225695567299379212578',
                        'description': 'இந்த பாடத்தில் தமிழ்மூலம் ஆங்கிலம் காற்று கொடுக்க சில செய்முறைகள் உள்ளன.',
                        'idealScreenSize': 'normal',
                        'createdOn': '2017-09-26T05:40:51.444+0000',
                        'me_totalSideloads': 2,
                        'me_totalComments': 0,
                        'popularity': 8501.46,
                        'contentDisposition': 'inline',
                        'lastUpdatedOn': '2017-09-26T05:54:00.324+0000',
                        'me_totalDevices': 160,
                        'me_totalDownloads': 2,
                        'owner': 'LeapForWord',
                        'createdFor': [
                            'org.ekstep.partner.lfw'
                        ],
                        'creator': 'LeapForWord Content',
                        'os': [
                            'All'
                        ],
                        'me_totalInteractions': 1124,
                        'pkgVersion': 6,
                        'versionKey': '1506404807156',
                        'idealScreenDensity': 'hdpi',
                        'framework': 'NCF',
                        // tslint:disable-next-line: max-line-length
                        's3Key': 'ecar_files/do_31225698054253772812594/1.5-vkupprrai-pyirrccikll-classroom-activities-ert_1506404806553_do_31225698054253772812594_6.0.ecar',
                        'lastSubmittedOn': '2017-09-26T05:40:58.789+0000',
                        'me_averageRating': 0,
                        'createdBy': '1224',
                        'compatibilityLevel': 2,
                        'organization': [
                            'LeapForWord'
                        ],
                        'resourceType': 'Learn'
                    }
                ],
                'contentEncoding': 'gzip',
                'mimeTypesCount': '{\'application/vnd.ekstep.ecml-archive\':4}',
                'contentType': 'Collection',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2017-09-26T11:45:01.830+0000',
                'lastUpdatedBy': '73f3d379-9bcf-4363-a38d-33d69b26586f',
                'identifier': 'do_3123405048187617282365',
                'audience': [
                    'Learner'
                ],
                // tslint:disable-next-line: max-line-length
                'toc_url': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_3123405048187617282365/artifact/do_3123405048187617282365toc.json',
                'visibility': 'Default',
                'contentTypesCount': '{\'Story\':4}',
                'consumerId': '0aa13c48-dda0-4259-9007-c795dacd7b9c',
                'mediaType': 'content',
                'ageGroup': [
                    'Other'
                ],
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '73f3d379-9bcf-4363-a38d-33d69b26586f',
                'tags': [
                    'LFW',
                    'Story'
                ],
                'size': 14465853,
                'lastPublishedOn': '2017-09-26T11:44:57.575+0000',
                'concepts': [
                    {
                        'identifier': 'LO4',
                        'name': 'Understanding of Grammar/Syntax',
                        'objectType': 'Concept',
                        'relation': 'associatedTo',
                        'description': 'Understanding of Grammar/Syntax',
                        'index': null,
                        'status': null,
                        'depth': null,
                        'mimeType': null,
                        'visibility': null,
                        'compatibilityLevel': null
                    }
                ],
                'domain': [
                    'literacy'
                ],
                'name': 'அடிப்படை வாசிப்பு',
                'status': 'Live',
                'code': 'do_3123405048187617282365',
                'description': 'அடிப்படை வாசிப்பு',
                // tslint:disable-next-line: max-line-length
                'posterImage': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_31221748466338201625192/artifact/reading_1491392171063.png',
                'idealScreenSize': 'normal',
                'createdOn': '2017-09-26T11:33:05.485+0000',
                'contentDisposition': 'inline',
                'lastUpdatedOn': '2017-09-26T11:51:35.018+0000',
                'createdFor': [
                    '0123221758376673287017',
                    'ORG_001'
                ],
                'creator': 'SaiPaluru',
                'os': [
                    'All'
                ],
                'pkgVersion': 3,
                'versionKey': '1506426301830',
                'idealScreenDensity': 'hdpi',
                'framework': 'NCF',
                's3Key': 'ecar_files/do_3123405048187617282365/attippttai-vaacippu_1506426300521_do_3123405048187617282365_3.0.ecar',
                'lastSubmittedOn': '2017-09-26T11:40:12.869+0000',
                'createdBy': '2defd89a-5ed9-4ced-8efd-9fabeebe0f03',
                'leafNodesCount': 2,
                'compatibilityLevel': 1,
                'board': 'State (Tamil Nadu)',
                'resourceType': 'Collection',
                'desktopAppMetadata': {
                    'addedUsing': 'download',
                    'createdOn': 1578635715771,
                    'updatedOn': 1578635715771,
                    'isAvailable': true
                }
            }
        }
    },
    updateCollection: {
        error: {
            'id': 'api.content.update',
            'ver': '1.0',
            'ts': '2020-01-09T13:26:30.759Z',
            'params': {
                'resmsgid': '474e6035-aac1-4065-8bd8-1a9c0e421bb8',
                'msgid': '9fcb1d7a-38fc-474a-82d3-c032b2f14e02',
                'status': 'failed',
                'err': 'ERR_BAD_REQUEST',
                'errmsg': 'Update not available'
            },
            'responseCode': 'CLIENT_ERROR',
            'result': {}
        },
        success: {
            id: 'api.content.update',
            params: {
                err: null,
                errmsg: null,
                msgid: '43a0b86b-9078-4f3d-89bd-7d163914eef3',
                resmsgid: '7c91d2ba-e3da-4ec8-9617-869ce15b733c',
                status: 'successful'
            },
            responseCode: 'OK',
            result: 'c30bb48c-d838-42fd-9a4c-fd802d7fbaf7',
            ts: '2020-01-09T13:28:39.797Z',
            ver: '1.0'
        }
    },
    exportCollection: {
        success: {
            destFolder: '/Users/icoblr/Downloads',
            message: 'SUCCESS',
            responseCode: 'OK',
        },
        error: {
            message: 'Ecar dest folder not selected',
            responseCode: 'NO_DEST_FOLDER'
        }
    },
    deleteCollection: {
        success: {
            'id': 'api.content.delete',
            'ver': '1.0',
            'ts': '2020-01-09T16:16:37.993Z',
            'params': {
                'resmsgid': '762c9459-ec28-44de-aea6-1ce41efa636b',
                'msgid': '72dbc649-6287-46e8-9c15-8a675bd9fc1d',
                'status': 'successful',
                'err': null,
                'errmsg': null
            },
            'responseCode': 'OK',
            'result': {
                'deleted': [],
                'failed': []
            }
        },
        error: {
            'id': 'api.content.delete',
            'ver': '1.0',
            'ts': '2020-01-09T16:18:38.060Z',
            'params': {
                'resmsgid': '17d08cb1-c600-44a5-a553-40febf7b7a74',
                'msgid': '4eeef24c-bcc5-4402-b4cf-6cb9f49a1ab0',
                'status': 'failed',
                'err': 'ERR_BAD_REQUEST',
                'errmsg': 'MISSING_CONTENTS'
            },
            'responseCode': 'CLIENT_ERROR',
            'result': {}
        }
    },
    downloadCollection: {
        success: {
            'id': 'api.content.download',
            'ver': '1.0',
            'ts': '2020-01-09T13:01:21.624Z',
            'params': {
                'resmsgid': 'e0c138b3-337b-4b15-ac23-ca71cebfd4c0',
                'msgid': 'b53395e2-7ffa-49c7-901c-1084309b5f7e',
                'status': 'successful',
                'err': null,
                'errmsg': null
            },
            'responseCode': 'OK',
            'result': {
                'downloadId': '82eba9b0-7650-4ebd-a28b-56c240056231'
            }
        },
        downloadError: {
            error: {
                'id': 'api.content.download',
                'ver': '1.0',
                'ts': '2020-01-09T13:11:09.835Z',
                'params': {
                    'resmsgid': '17b6ce47-a381-4d10-8dc1-54e8b07cecd7',
                    'msgid': '4b85b3c0-0a14-443f-a92b-6ddeef109f87',
                    'status': 'failed',
                    'err': 'ERR_INTERNAL_SERVER_ERROR',
                    'errmsg': 'Error while processing the request'
                },
                'responseCode': 'INTERNAL_SERVER_ERROR',
                'result': {}
            }
        }

    },
};
