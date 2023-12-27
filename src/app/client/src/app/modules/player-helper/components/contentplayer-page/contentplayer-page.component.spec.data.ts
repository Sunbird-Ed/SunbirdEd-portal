export const resourceData = {
    'PublicPlayer': {
        'contentApiQueryParams': {
            'orgdetails': 'orgName,email',
            'licenseDetails': 'name,description,url'
        }
    },
    'contentId': 'do_21260742513514086411607',
    'content': {
        'id': 'api.content.read',
        'ver': '1.0',
        'ts': '2020-01-02T06:14:08.201Z',
        'params': {
            'resmsgid': '66f87e80-7cb6-4f60-a603-35bca2096a1e',
            'msgid': '7f2d7e09-46c3-4af1-9642-6598f90211f2',
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
                'publish_type': 'public',
                // tslint:disable-next-line: max-line-length
                'previewUrl': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/ecml/do_21260742513514086411607-latest',
                'subject': 'Urdu',
                'downloadUrl': 'do_21260742513514086411607/1542779548981_do_21260742513514086411607.zip',
                'channel': '505c7c48ac6dc1edc9b08f21db5a571d',
                'organisation': [
                    'ABC Corporation',
                    'NTP'
                ],
                'language': [
                    'English'
                ],
                'mimeType': 'application/vnd.ekstep.ecml-archive',
                'variants': null,
                'objectType': 'Content',
                'appIcon': 'content/do_21260742513514086411607/edforall_1520506786573.thumb.jpg',
                'gradeLevel': [
                    'Class 1',
                    'Class 1'
                ],
                'appId': 'staging.diksha.portal',
                'contentEncoding': 'gzip',
                'artifactUrl': 'do_21260742513514086411607/1542779548981_do_21260742513514086411607.zip',
                'contentType': 'Resource',
                'lastUpdatedBy': '9d92839b-6f7e-447e-a1a2-505af40ea40f',
                'identifier': 'do_21260742513514086411607',
                'audience': [
                    'Learner'
                ],
                'publishChecklist': [
                    'You can go Live',
                    'Is suitable for children',
                    'No Discrimination or Defamation',
                    'No Sexual content, Nudity or Vulgarity',
                    'No Hate speech, Abuse, Violence, Profanity',
                    'Appropriate Title, Description',
                    'Correct Board, Grade, Subject, Medium',
                    'Appropriate tags such as Resource Type, Concepts',
                    'Relevant Keywords',
                    'Content plays correctly',
                    'Can see the content clearly on Desktop and App',
                    'Audio (if any) is clear and easy to understand',
                    'No Spelling mistakes in the text',
                    'Language is simple to understand'
                ],
                'visibility': 'Default',
                'consumerId': 'ae82a4be-2487-404f-bcac-61b28ad56482',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '9d92839b-6f7e-447e-a1a2-505af40ea40f',
                'prevState': 'Draft',
                'lastPublishedOn': '2018-11-21T05:52:29.155+0000',
                'size': 672290,
                'name': 'test 5895',
                'status': 'Live',
                'totalQuestions': 1,
                'code': 'org.sunbird.oUF5Ea',
                'publishError': null,
                'description': 'Untitled Collection',
                'medium': 'Hindi',
                'idealScreenSize': 'normal',
                'createdOn': '2018-10-08T09:52:06.067+0000',
                'contentDisposition': 'inline',
                'lastUpdatedOn': '2018-11-21T05:52:27.382+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2018-11-21T05:13:28.584+0000',
                'createdFor': [
                    '01229319659233280026',
                    'ORG_001'
                ],
                'creator': 'Anirban Choubey',
                'os': [
                    'All'
                ],
                'flagReasons': null,
                'totalScore': 9,
                'pkgVersion': '6',
                'versionKey': '1542779548558',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_21260742513514086411607/test-5895_1542303158287_do_21260742513514086411607_5.0.ecar',
                'framework': 'NCF',
                'lastSubmittedOn': '2018-11-13T05:33:18.666+0000',
                'createdBy': '002ccf83-4db0-4bd1-a9d0-254e6168e422',
                'compatibilityLevel': 2,
                'board': 'CBSE',
                'resourceType': 'Learn',
                'baseDir': 'content/do_21260742513514086411607',
                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'body': '',
                'me_averageRating': '',
                'userName': 'created_author',
                'desktopAppMetadata': {
                    'addedUsing': 'import',
                    'createdOn': 1577780630688,
                    'updatedOn': 1577780630688,
                    'artifactAdded': true
                }
            }
        }
    },
    contentError: {
        'id': 'api.content.read',
        'ver': '1.0',
        'ts': '2020-01-06T06:58:43.803Z',
        'params': {
            'resmsgid': 'ca6ab48a-3bea-4512-9fef-b1ea3c432618',
            'msgid': '73b69823-15f5-44fc-ab1b-afde774db085',
            'status': 'failed',
            'err': 'ERR_DATA_NOT_FOUND',
            'errmsg': 'Data not found'
        },
        'responseCode': 'RESOURCE_NOT_FOUND',
        'result': {}
    },
    resourceBundle: {
        messages: {
            emsg: {
                m0024: 'Unable to load content. Please try again'
            }
        }
    },
    configDetails: {
        config: {
            apislug: '/action',
            endPage: [{ template: 'assessment', contentType: ['SelfAssess'] }],
            host: '',
            overlay: { showUser: false },
            plugins: [{ id: 'org.sunbird.iframeEvent', ver: 1, type: 'plugin' },
            { id: 'org.sunbird.player.endpage', ver: 1.1, type: 'plugin' },
            ],

            previewCdnUrl: undefined,
            repos: ['/sunbird-plugins/renderer'],
            showEndPage: false,
            showStartPage: true,
            splash: { text: '', icon: '', bgImage: 'assets/icons/splacebackground_1.png', webLink: '' }
        },
        context: {
            channel: '505c7c48ac6dc1edc9b08f21db5a571d',
            contentId: 'do_21260742513514086411607',
            contextRollup: { l1: '505c7c48ac6dc1edc9b08f21db5a571d' },
            did: '439a102168d501bc0babd548bc61299b026edf93c0c585fd8c3037bec7a073f8',
            mode: 'play',
            partner: [],
            pdata: { id: 'prod.sunbird.desktop', ver: '1.0', pid: 'sunbird-portal' },
            sid: '2ae88658-d312-bae9-c251-3c1f31c62b65',
            timeDiff: -0.775,
            uid: 'anonymous'
        },
        data: '',
        metadata: {
            SYS_INTERNAL_LAST_UPDATED_ON: '2018-11-21T05:13:28.584+0000',
            appIcon: 'content/do_21260742513514086411607/edforall_1520506786573.thumb.jpg',
            appId: 'staging.diksha.portal',
            artifactUrl: 'do_21260742513514086411607/1542779548981_do_21260742513514086411607.zip',
            audience: ['Learner'],
            baseDir: 'content/do_21260742513514086411607',
            board: 'CBSE',
            channel: '505c7c48ac6dc1edc9b08f21db5a571d',
            code: 'org.sunbird.oUF5Ea',
            compatibilityLevel: 2,
            consumerId: 'ae82a4be-2487-404f-bcac-61b28ad56482',
            contentDisposition: 'inline',
            contentEncoding: 'gzip',
            contentType: 'Resource',
            createdBy: '002ccf83-4db0-4bd1-a9d0-254e6168e422',
            createdFor: ['01229319659233280026', 'ORG_001'],
            createdOn: '2018-10-08T09:52:06.067+0000',
            creator: 'Anirban Choubey',
            description: 'Untitled Collection',
            desktopAppMetadata: { addedUsing: 'import', createdOn: 1577780630688, updatedOn: 1577780630688, artifactAdded: true },
            downloadUrl: 'do_21260742513514086411607/1542779548981_do_21260742513514086411607.zip',
            flagReasons: null,
            framework: 'NCF',
            gradeLevel: ['Class 1', 'Class 1'],
            idealScreenDensity: 'hdpi',
            idealScreenSize: 'normal',
            identifier: 'do_21260742513514086411607',
            language: ['English'],
            lastPublishedBy: '9d92839b-6f7e-447e-a1a2-505af40ea40f',
            lastPublishedOn: '2018-11-21T05:52:29.155+0000',
            lastSubmittedOn: '2018-11-13T05:33:18.666+0000',
            lastUpdatedBy: '9d92839b-6f7e-447e-a1a2-505af40ea40f',
            lastUpdatedOn: '2018-11-21T05:52:27.382+0000',
            mediaType: 'content',
            medium: 'Hindi',
            mimeType: 'application/vnd.ekstep.ecml-archive',
            name: 'test 5895',
            objectType: 'Content',
            organisation: ['ABC Corporation', 'NTP'],
            os: ['All'],
            osId: 'org.ekstep.quiz.app',
            ownershipType: ['createdBy'],
            pkgVersion: 6,
            prevState: 'Draft',
            previewUrl: 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/ecml/do_21260742513514086411607-latest',
            publishChecklist: ['You can go Live', 'Is suitable for children', 'No Discrimination or Defamation',
                'No Sexual content, Nudity or Vulgarity', 'No Hate speech, Abuse, Violence, Profanity',
                'Appropriate Title, Description', 'Correct Board, Grade, Subject, Medium',
                'Appropriate tags such as Resource Type, Concepts', 'Relevant Keywords',
                'Content plays correctly', 'Can see the content clearly on Desktop and App',
                'Audio (if any) is clear and easy to understand', 'No Spelling mistakes in the text', 'Language is simple to understand'],
            publishError: null,
            publish_type: 'public',
            resourceType: 'Learn',
            s3Key: 'ecar_files/do_21260742513514086411607/test-5895_1542303158287_do_21260742513514086411607_5.0.ecar',
            size: 672290,
            status: 'Live',
            subject: 'Urdu',
            totalQuestions: 1,
            totalScore: 9,
            variants: null,
            versionKey: '1542779548558',
            visibility: 'Default'
        }
    },
    object: {
        id: 'do_21260742513514086411607',
        type: 'Resource',
        ver: '6',
    },
    option: {
        dialCode: '6G5YNV'
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

