export const mockRes = {
    successResponse: {
        'id': 'api.content.read',
        'ver': '1.0',
        'ts': '2018-08-13T11:43:29.487Z',
        'params': {
            'resmsgid': '1912d5f0-9eee-11e8-8a69-53bd79a7a0bb',
            'msgid': '19098720-9eee-11e8-9ccc-9d2df2ae7c20',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'content': {
                'code': 'a78140d6-d081-4677-b6d1-3578b8809b8d',
                'subject': 'Tamil',
                'description': 'Some description can go here',
                'language': [
                    'English'
                ],
                'medium': 'English',
                'mimeType': 'application/pdf',
                'createdOn': '2018-08-07T10:15:04.042+0000',
                'appIcon': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/1458674338407storyImage.png',
                'gradeLevel': [
                    'Grade 4'
                ],
                'collections': [],
                'artifactUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/assets/do_112563553517920256119/sample.pdf',
                'lastUpdatedOn': '2018-08-07T10:17:00.244+0000',
                'contentType': 'Resource',
                'identifier': 'do_112563553517920256119',
                'creator': 'Cretation User New',
                'audience': [
                    'Learner'
                ],
                'visibility': 'Default',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'languageCode': 'en',
                'versionKey': '1533637020244',
                'framework': 'NCFCOPY',
                'concepts': [
                    {
                        'identifier': 'BIO2',
                        'name': 'Human_Anatomy_and_Physiology',
                        'objectType': 'Concept',
                        'relation': 'associatedTo',
                        'description': null,
                        'index': null,
                        'status': null,
                        'depth': null,
                        'mimeType': null,
                        'visibility': null,
                        'compatibilityLevel': null
                    }
                ],
                'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'name': 'Venkat PDF testing',
                'usedByContent': [],
                'board': 'TN Board',
                'resourceType': 'Test',
                'status': 'Review'
            }
        }
    },
    requestChangesChecklist: {
        'id': 'api.form.read',
        'ver': '1.0',
        'ts': '2018-08-13T13:04:11.693Z',
        'params': {
            'resmsgid': '5f40d5d0-9ef9-11e8-a42e-8d80f5a79851',
            'msgid': '5f2fe5e0-9ef9-11e8-98b7-6dc4760abe27',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'form': {
                'type': 'content',
                'action': 'requestChangesChecklist',
                'subType': 'Resource',
                'rootOrgId': 'b00bc992ef25f1a9a8d63291e20efc8d',
                'data': {
                    'templateName': 'defaultTemplate',
                    'action': 'requestChangesChecklist',
                    'fields': [
                        {
                            'title': 'Please tick the reasons for requesting changes and provide detailed comments:',
                            'otherReason': '',
                            'contents': [
                                {
                                    'name': 'Appropriateness',
                                    'checkList': [
                                        'Has Hate speech, Abuse, Violence, Profanity',
                                        'Has Sexual content, Nudity or Vulgarity',
                                        'Has Discriminatory or Defamatory content',
                                        'Is not suitable for children'
                                    ]
                                },
                                {
                                    'name': 'Content details',
                                    'checkList': [
                                        'Inappropriate Title or Description',
                                        'Incorrect Board, Grade, Subject or Medium',
                                        'Inappropriate tags such as Resource Type or Concepts',
                                        'Irrelevant Keywords'
                                    ]
                                },
                                {
                                    'name': 'Usability',
                                    'checkList': [
                                        'Content is NOT playing correctly',
                                        'CANNOT see the content clearly on Desktop and App',
                                        'Audio is NOT clear or NOT easy to understand',
                                        'Spelling mistakes found in text used',
                                        'Language is NOT simple to understand'
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        }
    },
    requestChangesChecklistWrongConfig : {
        'id': 'api.form.read',
        'ver': '1.0',
        'ts': '2018-09-06T08:58:02.746Z',
        'params': {
         'resmsgid': 'f6305da0-b1b2-11e8-b9af-892175229f78',
         'msgid': 'f62d0240-b1b2-11e8-9c79-1d0b266b0c77',
         'status': 'successful',
         'err': null,
         'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
         'form': {
          'type': 'content',
          'action': 'requestforchanges',
          'subType': 'resource',
          'rootOrgId': '012315809814749184151',
          'data': {
           'action': 'requestforchanges',
           'templateName': 'defaultTemplate',
           'fields': [
            {
             'title': 'Please detail the required changes in the comments.'
            }
           ]
          }
         }
        }
       },
};
