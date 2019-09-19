export const validateCertMockResponse = {
    successResponse: {
        'id': '',
        'ver': 'private',
        'ts': '2019-09-10 07:29:40:416+0000',
        'params': {
            'resmsgid': null,
            'msgid': '3830f7a6-01dc-9188-bee8-bd10cc9a2a2c',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'pdf': 'https://anc.com',
                'json': {
                    'id': 'http://localhost:8080/_schemas/Certificate/d5a28280-98ac-4294-a508-21075dc7d475',
                    'type': [
                        'Assertion',
                        'Extension',
                        'extensions:CertificateExtension'
                    ],
                    'issuedOn': '2019-08-31T12:52:25Z',
                    'recipient': {
                        'identity': 'ntptest103',
                        'type': [
                            'phone'
                        ],
                        'hashed': false,
                        'name': 'Aishwarya',
                        '@context': 'http://localhost:8080/_schemas/context.json'
                    },
                    'badge': {
                        'id': 'http://localhost:8080/_schemas/Badge.json',
                        'type': [
                            'BadgeClass'
                        ],
                        'name': 'Sunbird installation',
                        'description': 'Certificate of Appreciation in National Level ITI Grading',
                        'image': 'https://certs.example.gov/o/dgt/HJ5327VB1247G',
                        'criteria': {
                            'type': [
                                'Criteria'
                            ],
                            'id': 'http://localhost:8080/_schemas/Certificate/d5a28280-98ac-4294-a508-21075dc7d475',
                            'narrative': 'For exhibiting outstanding performance'
                        },
                        'issuer': {
                            'context': 'http://localhost:8080/_schemas/context.json',
                            'id': 'http://localhost:8080/_schemas/Issuer.json',
                            'type': [
                                'Issuer'
                            ],
                            'name': 'NIIT'
                        },
                        '@context': 'http://localhost:8080/_schemas/context.json'
                    },
                    'expires': '2019-09-30T12:52:25Z',
                    'verification': {
                        'type': [
                            'SignedBadge'
                        ],
                        'creator': 'http://localhost:8080/_schemas/publicKey.json'
                    },
                    'revoked': false,
                    'validFrom': '2019-06-21',
                    '@context': 'http://localhost:8080/_schemas/context.json'
                },
                'batchId': null,
                'courseId': null
            }
        }
    },
    errorRespone: {
        'id': '',
        'ver': 'private',
        'ts': '2019-08-09 06:36:01:735+0000',
        'params': {
            'resmsgid': null,
            'msgid': '9ee5a376-9e09-76d0-abb5-ebcf658e645b',
            'err': 'INVALID_PARAMETER',
            'status': 'INVALID_PARAMETER',
            'errmsg': 'Please provide valid accessCode.'
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {
        }
    },
    getCourseIdResponse: {
        'id': 'api.course.hierarchy',
        'ver': '1.0',
        'ts': '2019-09-10T08:43:24.333Z',
        'params': {
            'resmsgid': '0d0aedd0-d3a7-11e9-953c-0be7c8ef2b37',
            'msgid': '341222c0-58a8-2a3c-f090-62ba91c105e1',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'content': {
                'ownershipType': [
                    'createdBy'
                ],
                'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
                'organisation': [
                    'Sunbird'
                ],
                'language': [
                    'English'
                ],
                'variants': {
                    'online': {
                        'size': 4039
                    },
                    'spine': {
                        'size': 38624
                    }
                },
                'mimeType': 'application/vnd.ekstep.content-collection',
                'leafNodes': [
                    'do_112831862871203840114'
                ],
                'objectType': 'Content',
                'collections': [

                ],
                'children': [
                    {
                        'parent': 'do_112832377710125056110',
                        'identifier': 'do_112832377987080192111',
                        'copyright': 'Sunbird',
                        'lastStatusChangedOn': '2019-08-22T05:39:51.001+0000',
                        'code': '3d7973a7-243d-4489-aea5-b6e40591671c',
                        'visibility': 'Parent',
                        'index': 1,
                        'mimeType': 'application/vnd.ekstep.content-collection',
                        'createdOn': '2019-08-22T05:39:51.001+0000',
                        'versionKey': '1566452391001',
                        'framework': 'tpd',
                        'depth': 1,
                        'children': [
                            {
                                'ownershipType': [
                                    'createdBy'
                                ],
                                'copyright': 'ORG_002',
                                'channel': '01246944855007232011',
                                'questions': [

                                ],
                                'organisation': [
                                    'ORG_002'
                                ],
                                'showNotification': true,
                                'language': [
                                    'English'
                                ],
                                'mimeType': 'video/mp4',
                                'variants': {
                                    'spine': {
                                        'size': 35757
                                    }
                                },
                                'collections': [
                                    {
                                        'identifier': 'do_11283192356041523212',
                                        'name': 'TestCoursePradCert',
                                        'objectType': 'Content',
                                        'relation': 'hasSequenceMember',
                                        'description': 'certificate course',
                                        'status': 'Live'
                                    },
                                    {
                                        'identifier': 'do_11283193441064550414',
                                        'name': 'test prad course cert',
                                        'objectType': 'Content',
                                        'relation': 'hasSequenceMember',
                                        'description': 'Enter description for Course',
                                        'status': 'Live'
                                    },
                                    {
                                        'identifier': 'do_11283183576849612818',
                                        'name': 'Test Course',
                                        'objectType': 'Content',
                                        'relation': 'hasSequenceMember',
                                        'description': 'Enter description for Course',
                                        'status': 'Live'
                                    }
                                ],
                                'children': [

                                ],
                                'appId': 'dev.sunbird.portal',
                                'usesContent': [

                                ],
                                'contentEncoding': 'identity',
                                'lockKey': 'be6bc445-c75e-471d-b46f-71fefe4a1d2f',
                                'contentType': 'Resource',
                                'item_sets': [

                                ],
                                'lastUpdatedBy': 'c4cc494f-04c3-49f3-b3d5-7b1a1984abad',
                                'identifier': 'do_112831862871203840114',
                                'audience': [
                                    'Learner'
                                ],
                                'visibility': 'Default',
                                'consumerId': '273f3b18-5dda-4a27-984a-060c7cd398d3',
                                'mediaType': 'content',
                                'osId': 'org.ekstep.quiz.app',
                                'lastPublishedBy': 'System',
                                'version': 1,
                                'prevState': 'Draft',
                                'license': 'Creative Commons Attribution (CC BY)',
                                'lastPublishedOn': '2019-08-21T12:15:13.652+0000',
                                'size': 416488,
                                'concepts': [

                                ],
                                'name': 'Test Resource Cert',
                                'status': 'Live',
                                'code': '7e6630c7-3818-4319-92ac-4d08c33904d8',
                                'methods': [

                                ],
                                'idealScreenSize': 'normal',
                                'createdOn': '2019-08-21T12:11:50.644+0000',
                                'contentDisposition': 'inline',
                                'lastUpdatedOn': '2019-08-21T12:15:13.020+0000',
                                'SYS_INTERNAL_LAST_UPDATED_ON': '2019-08-21T12:30:16.783+0000',
                                'dialcodeRequired': 'No',
                                'creator': 'Pradyumna',
                                'lastStatusChangedOn': '2019-08-21T12:15:14.384+0000',
                                'createdFor': [
                                    '01246944855007232011'
                                ],
                                'os': [
                                    'All'
                                ],
                                'libraries': [

                                ],
                                'pkgVersion': 1,
                                'versionKey': '1566389713020',
                                'idealScreenDensity': 'hdpi',
                                'framework': 'K-12',
                                'createdBy': 'c4cc494f-04c3-49f3-b3d5-7b1a1984abad',
                                'compatibilityLevel': 1,
                                'resourceType': 'Learn',
                                'index': 1,
                                'depth': 2
                            }
                        ],
                        'name': 'U1',
                        'lastUpdatedOn': '2019-08-22T05:40:22.424+0000',
                        'contentType': 'CourseUnit',
                        'status': 'Live',
                        'compatibilityLevel': 1,
                        'lastPublishedOn': '2019-08-22T05:40:22.472+0000',
                        'pkgVersion': 1,
                        'leafNodesCount': 1,
                    }
                ],
                'appId': 'dev.sunbird.portal',
                'contentEncoding': 'gzip',
                'lockKey': '8d11f1c0-97bf-4555-81d5-ed7bdcb920d8',
                'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\':1,\'video/mp4\':1}',
                'totalCompressedSize': 416488,
                'contentType': 'Course',
                'identifier': 'do_112832377710125056110',
                'audience': [
                    'Learner'
                ],
                'visibility': 'Default',
                'contentTypesCount': '{\'CourseUnit\':1,\'Resource\':1}',
                'childNodes': [
                    'do_112831862871203840114',
                    'do_112832377987080192111'
                ],
                'consumerId': '273f3b18-5dda-4a27-984a-060c7cd398d3',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': 'System',
                'version': 2,
                'prevState': 'Draft',
                'license': 'Creative Commons Attribution (CC BY)',
                'lastPublishedOn': '2019-08-22T05:40:22.472+0000',
                'size': 38624,
                'name': 'Test Certificate Course Showcase',
                'status': 'Live',
                'code': 'org.sunbird.MwT2Oh',
                'description': 'test',
                'idealScreenSize': 'normal',
                'createdOn': '2019-08-22T05:39:17.192+0000',
                'contentDisposition': 'inline',
                'lastUpdatedOn': '2019-08-22T05:40:22.424+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2019-08-22T05:40:23.643+0000',
                'dialcodeRequired': 'No',
                'creator': 'Creation',
                'lastStatusChangedOn': '2019-08-22T05:40:23.638+0000',
                'createdFor': [
                    'ORG_001'
                ],
                'os': [
                    'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1566452422424',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_112832377710125056110/do_112832377710125056110_1.0_spine.ecar',
                'depth': 0,
                'framework': 'tpd',
                'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'leafNodesCount': 1,
                'compatibilityLevel': 4,
                'usedByContent': [

                ],
                'resourceType': 'Course',
                'reservedDialcodes': {
                    'W1F6Z2': 0
                },
                'c_sunbird_dev_open_batch_count': 0,
                'certVideoUrl': 'https://sunbirddev.blob.core.windows.net/do_112831862871203840114/small.mp4',
                'certTemplate': [
                    {
                        'name': '100PercentCompletionCertificate',
                        'issuer': {
                            'name': 'Gujarat Council of Educational Research and Training',
                            'url': 'https://gcert.gujarat.gov.in/gcert/',
                            'publicKey': [
                                '1',
                                '2'
                            ]
                        },
                        'signatoryList': [
                            {
                                'name': 'CEO Gujarat',
                                'id': 'CEO',
                                'designation': 'CEO',
                                'image': 'https://cdn.pixabay.com/photo/2014/11/09/08/06/signature-523237__340.jpg'
                            }
                        ],
                        'htmlTemplate': 'https://drive.google.com/uc?authuser=1&id=1ryB71i0Oqn2c3aqf9N6Lwvet-MZKytoM&export=download',
                        'notifyTemplate': {
                            'subject': 'Course completion certificate',
                            'stateImgUrl': 'https://sunbirddev.blob.core.windows.net/orgemailtemplate/img/File-0128212938260643843.png',
                            'regardsperson': 'Chairperson',
                            'regards': 'Minister of Gujarat',
                            'emailTemplateType': 'defaultCertTemp'
                        }
                    }
                ]
            }
        }
    },
    getContentResponse: {
        'id': 'api.content.read',
        'ver': '1.0',
        'ts': '2019-09-10T09:23:52.401Z',
        'params': {
            'resmsgid': 'b448b410-d3ac-11e9-953c-0be7c8ef2b37',
            'msgid': '0ca19e30-846d-9a68-80b8-f823fdd7c974',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'content': {
                'copyright': 'ORG_002',
                'channel': '01246944855007232011',
                'language': [
                    'English'
                ],
                'mimeType': 'video/mp4',
                'contentType': 'Resource',
                'identifier': 'do_112831862871203840114',
                'audience': [
                    'Learner'
                ],
                'visibility': 'Default',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'license': 'Creative Commons Attribution (CC BY)',
                'concepts': [

                ],
                'name': 'Test Resource Cert',
                'status': 'Live',
                'code': '7e6630c7-3818-4319-92ac-4d08c33904d8',
                'createdOn': '2019-08-21T12:11:50.644+0000',
                'lastUpdatedOn': '2019-08-21T12:15:13.020+0000',
                'creator': 'Pradyumna',
                'pkgVersion': 1,
                'versionKey': '1566389713020',
                'framework': 'K-12',
                'createdBy': 'c4cc494f-04c3-49f3-b3d5-7b1a1984abad',
                'resourceType': 'Learn',
                'languageCode': 'en',
                'orgDetails': {
                    'email': null,
                    'orgName': 'ORG_002'
                }
            }
        }
    }
};
