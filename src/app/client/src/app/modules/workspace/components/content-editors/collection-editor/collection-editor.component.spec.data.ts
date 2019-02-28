export const mockRes = {
    successResult: {
        'id': 'api.content.read',
        'ver': '1.0',
        'ts': '2018-04-10T13:02:45.415Z',
        'params': {
            'resmsgid': '76311b70-3cbf-11e8-8758-7f5b4fe67033',
            'msgid': '762582b0-3cbf-11e8-bfb0-2527c99bf99d',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'content': {
                'identifier': 'do_21247940906829414411032',
                'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'mimeType': 'application/vnd.ekstep.content-collection',
                'languageCode': 'en',
                'status': 'Draft'
            }
        }
    },
    errorResult: {
        'responseCode': 'ERROR',
        'result': {
            'content': {
                'identifier': 'do_21247940906829414411032',
                'createdBy': '68777b59-b28b-4aee-88d6-50d46e4c3509',
                'mimeType': 'application/vnd.ekstep.content-collections',
                'languageCode': 'en',
                'status': 'listed'
            }
        }
    },
    tenantMockData: {
            'titleName': 'Sunbird',
            'logo': 'http://localhost:3000/assets/images/sunbird_logo.png',
            'poster': 'http://localhost:3000/assets/images/sunbird_logo.png',
            'favicon': 'http://localhost:3000/assets/images/favicon.ico',
            'appLogo': 'http://localhost:3000/assets/images/sunbird_logo.png'
        },
        frameworkData: {
            'defaultFramework': {
              'owner': 'in.ekstep',
              'identifier': 'NCF',
              'code': 'NCF',
              'consumerId': 'a6654129-b58d-4dd8-9cf2-f8f3c2f458bc',
              'channel': 'in.ekstep',
              'description': 'NCF framework.',
              'type': 'K-12',
              'createdOn': '2018-01-23T09:53:50.189+0000',
              'versionKey': '1523427061978',
              'channels': [
                {
                  'identifier': 'b00bc992ef25f1a9a8d63291e20efc8d',
                  'name': 'Sunbird',
                  'objectType': 'Channel',
                  'relation': 'hasSequenceMember',
                  'description': 'Channel for sunbird dev',
                  'index': null,
                  'status': null,
                  'depth': null,
                  'mimeType': null,
                  'visibility': null,
                  'compatibilityLevel': null
                },
                {
                  'identifier': 'in.ekstep',
                  'name': 'Ekstep',
                  'objectType': 'Channel',
                  'relation': 'hasSequenceMember',
                  'description': 'Channel for in.ekstep',
                  'index': null,
                  'status': null,
                  'depth': null,
                  'mimeType': null,
                  'visibility': null,
                  'compatibilityLevel': null
                }
              ],
              'appId': 'ekstep_portal',
              'name': 'NCF framework',
              'lastUpdatedOn': '2018-04-11T06:11:01.978+0000',
              'categories': [
                {
                  'identifier': 'ncf_board',
                  'code': 'board',
                  'terms': [
                    {
                      'associations': [
                        {
                          'identifier': 'ncf_gradelevel_kindergarten',
                          'code': 'kindergarten',
                          'name': 'Kindergarten',
                          'description': '',
                          'category': 'gradeLevel',
                          'status': 'Live'
                        },
                        {
                          'identifier': 'ncf_gradelevel_grade1',
                          'code': 'grade1',
                          'name': 'Grade 1',
                          'description': '',
                          'category': 'gradeLevel',
                          'status': 'Live'
                        },
                        {
                          'identifier': 'ncf_gradelevel_grade2',
                          'code': 'grade2',
                          'name': 'Grade 2',
                          'description': '',
                          'category': 'gradeLevel',
                          'status': 'Live'
                        },
                        {
                          'identifier': 'ncf_gradelevel_grade4',
                          'code': 'grade4',
                          'name': 'Grade 4',
                          'description': '',
                          'category': 'gradeLevel',
                          'status': 'Live'
                        },
                        {
                          'identifier': 'ncf_gradelevel_grade3',
                          'code': 'grade3',
                          'name': 'Grade 3',
                          'description': '',
                          'category': 'gradeLevel',
                          'status': 'Live'
                        },
                        {
                          'identifier': 'ncf_gradelevel_grade5',
                          'code': 'grade5',
                          'name': 'Grade 5',
                          'description': '',
                          'category': 'gradeLevel',
                          'status': 'Live'
                        }
                      ],
                      'identifier': 'ncf_board_ncert',
                      'code': 'ncert',
                      'name': 'NCERT',
                      'description': '',
                      'index': 1,
                      'category': 'board',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_board_cbse',
                      'code': 'cbse',
                      'name': 'CBSE',
                      'description': '',
                      'index': 2,
                      'category': 'board',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_board_icse',
                      'code': 'icse',
                      'name': 'ICSE',
                      'description': '',
                      'index': 3,
                      'category': 'board',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_board_upboard',
                      'code': 'upboard',
                      'name': 'UP Board',
                      'description': '',
                      'index': 4,
                      'category': 'board',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_board_apboard',
                      'code': 'apboard',
                      'name': 'AP Board',
                      'description': '',
                      'index': 5,
                      'category': 'board',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_board_tnboard',
                      'code': 'tnboard',
                      'name': 'TN Board',
                      'description': '',
                      'index': 6,
                      'category': 'board',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_board_ncte',
                      'code': 'ncte',
                      'name': 'NCTE',
                      'description': '',
                      'index': 7,
                      'category': 'board',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_board_mscert',
                      'code': 'mscert',
                      'name': 'MSCERT',
                      'description': '',
                      'index': 8,
                      'category': 'board',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_board_bser',
                      'code': 'bser',
                      'name': 'BSER',
                      'description': '',
                      'index': 9,
                      'category': 'board',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_board_others',
                      'code': 'others',
                      'name': 'Others',
                      'description': 'others',
                      'index': 10,
                      'category': 'board',
                      'status': 'Live'
                    }
                  ],
                  'name': 'Curriculum',
                  'description': '',
                  'index': 1,
                  'status': 'Live'
                },
                {
                  'identifier': 'ncf_gradelevel',
                  'code': 'gradeLevel',
                  'terms': [
                    {
                      'identifier': 'ncf_gradelevel_kindergarten',
                      'code': 'kindergarten',
                      'name': 'Kindergarten',
                      'description': '',
                      'index': 1,
                      'category': 'gradeLevel',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_gradelevel_grade1',
                      'code': 'grade1',
                      'name': 'Grade 1',
                      'description': '',
                      'index': 2,
                      'category': 'gradeLevel',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_gradelevel_grade2',
                      'code': 'grade2',
                      'name': 'Grade 2',
                      'description': '',
                      'index': 3,
                      'category': 'gradeLevel',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_gradelevel_grade3',
                      'code': 'grade3',
                      'name': 'Grade 3',
                      'description': '',
                      'index': 4,
                      'category': 'gradeLevel',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_gradelevel_grade4',
                      'code': 'grade4',
                      'name': 'Grade 4',
                      'description': '',
                      'index': 5,
                      'category': 'gradeLevel',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_gradelevel_grade5',
                      'code': 'grade5',
                      'name': 'Grade 5',
                      'description': '',
                      'index': 6,
                      'category': 'gradeLevel',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_gradelevel_grade6',
                      'code': 'grade6',
                      'name': 'Grade 6',
                      'description': '',
                      'index': 7,
                      'category': 'gradeLevel',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_gradelevel_grade7',
                      'code': 'grade7',
                      'name': 'Grade 7',
                      'description': '',
                      'index': 8,
                      'category': 'gradeLevel',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_gradelevel_grade8',
                      'code': 'grade8',
                      'name': 'Grade 8',
                      'description': '',
                      'index': 9,
                      'category': 'gradeLevel',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_gradelevel_grade9',
                      'code': 'grade9',
                      'name': 'Grade 9',
                      'description': '',
                      'index': 10,
                      'category': 'gradeLevel',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_gradelevel_grade10',
                      'code': 'grade10',
                      'name': 'Grade 10',
                      'description': '',
                      'index': 11,
                      'category': 'gradeLevel',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_gradelevel_grade11',
                      'code': 'grade11',
                      'name': 'Grade 11',
                      'description': '',
                      'index': 12,
                      'category': 'gradeLevel',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_gradelevel_grade12',
                      'code': 'grade12',
                      'name': 'Grade 12',
                      'description': '',
                      'index': 13,
                      'category': 'gradeLevel',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_gradelevel_others',
                      'code': 'others',
                      'name': 'Other',
                      'description': '',
                      'index': 14,
                      'category': 'gradeLevel',
                      'status': 'Live'
                    }
                  ],
                  'name': 'Class',
                  'description': '',
                  'index': 2,
                  'status': 'Live'
                },
                {
                  'identifier': 'ncf_subject',
                  'code': 'subject',
                  'terms': [
                    {
                      'identifier': 'ncf_subject_mathematics',
                      'code': 'mathematics',
                      'name': 'Mathematics',
                      'description': '',
                      'index': 1,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_english',
                      'code': 'english',
                      'name': 'English',
                      'description': '',
                      'index': 2,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_tamil',
                      'code': 'tamil',
                      'name': 'Tamil',
                      'description': '',
                      'index': 3,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_telugu',
                      'code': 'telugu',
                      'name': 'Telugu',
                      'description': '',
                      'index': 4,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_geography',
                      'code': 'geography',
                      'name': 'Geography',
                      'description': '',
                      'index': 5,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_urdu',
                      'code': 'urdu',
                      'name': 'Urdu',
                      'description': '',
                      'index': 6,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_kannada',
                      'code': 'kannada',
                      'name': 'Kannada',
                      'description': '',
                      'index': 7,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_assamese',
                      'code': 'assamese',
                      'name': 'Assamese',
                      'description': '',
                      'index': 8,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_physics',
                      'code': 'physics',
                      'name': 'Physics',
                      'description': '',
                      'index': 9,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_chemistry',
                      'code': 'chemistry',
                      'name': 'Chemistry',
                      'description': '',
                      'index': 10,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_hindi',
                      'code': 'hindi',
                      'name': 'Hindi',
                      'description': '',
                      'index': 11,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_marathi',
                      'code': 'marathi',
                      'name': 'Marathi',
                      'description': '',
                      'index': 12,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_environmentalstudies',
                      'code': 'environmentalstudies',
                      'name': 'Environmental Studies',
                      'description': '',
                      'index': 13,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_politicalscience',
                      'code': 'politicalscience',
                      'name': 'Political Science',
                      'description': '',
                      'index': 14,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_bengali',
                      'code': 'bengali',
                      'name': 'Bengali',
                      'description': '',
                      'index': 15,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_history',
                      'code': 'history',
                      'name': 'History',
                      'description': '',
                      'index': 16,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_gujarati',
                      'code': 'gujarati',
                      'name': 'Gujarati',
                      'description': '',
                      'index': 17,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_biology',
                      'code': 'biology',
                      'name': 'Biology',
                      'description': '',
                      'index': 18,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_oriya',
                      'code': 'oriya',
                      'name': 'Oriya',
                      'description': '',
                      'index': 19,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_punjabi',
                      'code': 'punjabi',
                      'name': 'Punjabi',
                      'description': '',
                      'index': 20,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_nepali',
                      'code': 'nepali',
                      'name': 'Nepali',
                      'description': '',
                      'index': 21,
                      'category': 'subject',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_subject_malayalam',
                      'code': 'malayalam',
                      'name': 'Malayalam',
                      'description': '',
                      'index': 22,
                      'category': 'subject',
                      'status': 'Live'
                    }
                  ],
                  'name': 'Subject',
                  'description': '',
                  'index': 3,
                  'status': 'Live'
                },
                {
                  'identifier': 'ncf_medium',
                  'code': 'medium',
                  'terms': [
                    {
                      'identifier': 'ncf_medium_english',
                      'code': 'english',
                      'name': 'English',
                      'description': '',
                      'index': 1,
                      'category': 'medium',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_medium_hindi',
                      'code': 'hindi',
                      'name': 'Hindi',
                      'description': '',
                      'index': 2,
                      'category': 'medium',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_medium_oriya',
                      'code': 'oriya',
                      'name': 'Oriya',
                      'description': '',
                      'index': 3,
                      'category': 'medium',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_medium_telugu',
                      'code': 'telugu',
                      'name': 'Telugu',
                      'description': '',
                      'index': 4,
                      'category': 'medium',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_medium_kannada',
                      'code': 'kannada',
                      'name': 'Kannada',
                      'description': '',
                      'index': 5,
                      'category': 'medium',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_medium_marathi',
                      'code': 'marathi',
                      'name': 'Marathi',
                      'description': '',
                      'index': 6,
                      'category': 'medium',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_medium_assamese',
                      'code': 'assamese',
                      'name': 'Assamese',
                      'description': '',
                      'index': 7,
                      'category': 'medium',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_medium_bengali',
                      'code': 'bengali',
                      'name': 'Bengali',
                      'description': '',
                      'index': 8,
                      'category': 'medium',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_medium_gujarati',
                      'code': 'gujarati',
                      'name': 'Gujarati',
                      'description': '',
                      'index': 9,
                      'category': 'medium',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_medium_urdu',
                      'code': 'urdu',
                      'name': 'Urdu',
                      'description': '',
                      'index': 10,
                      'category': 'medium',
                      'status': 'Live'
                    },
                    {
                      'identifier': 'ncf_medium_other',
                      'code': 'other',
                      'name': 'Other',
                      'description': '',
                      'index': 11,
                      'category': 'medium',
                      'status': 'Live'
                    }
                  ],
                  'name': 'Medium',
                  'description': '',
                  'index': 4,
                  'status': 'Live'
                }
              ],
              'status': 'Live'
            }
          }
};
