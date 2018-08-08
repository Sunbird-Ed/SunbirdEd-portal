export const mockData = {
    error: {
        'id': 'api.form.read',
        'ver': '1.0',
        'ts': '2018-04-12T12:43:51.570Z',
        'params': {
            'resmsgid': '27319720-3e4f-11e8-9601-6bb03ac3785c',
            'msgid': '272e62d0-3e4f-11e8-ba4c-69964c53fa34',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': { 'tenantPreference': [] }
    },
    success: {
        'id': 'api.form.read',
        'ver': '1.0',
        'ts': '2018-04-12T12:29:30.124Z',
        'params':
            {
                'resmsgid': '25bb5cc0-3e4d-11e8-9601-6bb03ac3785c',
                'msgid': '25b73e10-3e4d-11e8-ba4c-69964c53fa34',
                'status': 'successful',
                'err': null,
                'errmsg': null
            }, 'responseCode': 'OK',
        'result': {
            'form': {
                'type': 'content', 'action': 'create',
                'subType': 'lessonplan', 'rootOrgId': 'b00bc992ef25f1a9a8d63291e20efc8d', 'framework': 'NCF',
                'data': {
                    'templateName': 'defaultTemplate', 'action': 'create',
                    'fields': [
                        {
                            'code': 'name',
                            'dataType': 'text',
                            'name': 'Name',
                            'lable': 'Name',
                            'description': 'Name',
                            'editable': true,
                            'placeholder': 'Name',
                            'inputType': 'text',
                            'required': false,
                            'displayProperty': 'Editable',
                            'visible': true,
                            'renderingHints': { 'semanticColumnWidth': 'twelve' }, 'index': 1
                        },
                        {
                            'code': 'board', 'dataType': 'text', 'name': 'Board', 'lable': 'Board',
                            'description': 'Education Board (Like MP Board, NCERT, etc)',
                            'editable': true, 'placeholder': 'Board', 'inputType': 'select', 'required': false,
                            'displayProperty': 'Editable', 'visible': true,
                            'renderingHints': { 'semanticColumnWidth': 'six' }, 'index': 2,
                            'depends': ['gradeLevel']
                        },
                        {
                            'code': 'gradeLevel',
                            'dataType': 'text',
                            'name': 'Grade',
                            'lable': 'Grade',
                            'description': 'Grade',
                            'editable': true,
                            'placeholder': 'Grade',
                            'inputType': 'multiSelect',
                            'required': false,
                            'displayProperty': 'Editable',
                            'visible': true,
                            'renderingHints': { 'semanticColumnWidth': 'six' }, 'index': 3,
                            'depends': ['subject']
                        },
                        {
                            'code': 'subject',
                            'dataType': 'text',
                            'name': 'Subject',
                            'lable': 'Subject',
                            'description': 'Subject of the Content to use to teach',
                            'editable': true, 'placeholder': 'Grade', 'inputType': 'select',
                            'required': false, 'displayProperty': 'Editable', 'visible': true,
                            'renderingHints': { 'semanticColumnWidth': 'six' }, 'index': 4
                        },
                        {
                            'code': 'medium',
                            'dataType': 'text',
                            'name': 'Medium',
                            'lable': 'Medium',
                            'description': 'Medium of instruction', 'editable': true,
                            'placeholder': 'Medium', 'inputType': 'select',
                            'required': false, 'displayProperty': 'Editable',
                            'visible': true, 'renderingHints': { 'semanticColumnWidth': 'six' },
                            'index': 5
                        }
                    ]
                }
            }
        }
    },

    frameworkAssociations: {
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
                'code': 'grade1', 'name': 'Grade 1',
                'description': '', 'category': 'gradeLevel',
                'status': 'Live'
            },
            {
                'identifier': 'ncf_gradelevel_grade2',
                'code': 'grade2', 'name': 'Grade 2',
                'description': '', 'category': 'gradeLevel',
                'status': 'Live'
            },
            {
                'identifier': 'ncf_gradelevel_grade4',
                'code': 'grade4', 'name': 'Grade 4',
                'description': '', 'category': 'gradeLevel',
                'status': 'Live'
            },
            {
                'identifier': 'ncf_gradelevel_grade3',
                'code': 'grade3', 'name': 'Grade 3',
                'description': '', 'category': 'gradeLevel',
                'status': 'Live'
            },
            {
                'identifier': 'ncf_gradelevel_grade5',
                'code': 'grade5', 'name': 'Grade 5',
                'description': '', 'category': 'gradeLevel',
                'status': 'Live'
            }],
        'identifier': 'ncf_board_ncert',
        'code': 'ncert', 'name': 'NCERT', 'description': '', 'index': 1, 'category': 'board', 'status': 'Live'
    },

    frameworkSuccess: {
        'id': 'api.framework.read',
        'ver': '1.0',
        'ts': '2018-04-12T12:43:30.680Z',
        'params': {
            'resmsgid': '1abe0780-3e4f-11e8-9601-6bb03ac3785c',
            'msgid': '1ab024d0-3e4f-11e8-ba4c-69964c53fa34', 'status': 'successful', 'err': null, 'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'framework': {
                'owner': 'in.ekstep',
                'identifier': 'NCF',
                'code': 'NCF',
                'consumerId': 'a6654129-b58d-4dd8-9cf2-f8f3c2f458bc',
                'channel': 'in.ekstep', 'description': 'NCF framework.',
                'type': 'K-12',
                'createdOn': '2018-01-23T09:53:50.189+0000',
                'versionKey': '1523427061978',
                'channels': [{
                    'identifier': 'b00bc992ef25f1a9a8d63291e20efc8d', 'name': 'Sunbird',
                    'objectType': 'Channel', 'relation': 'hasSequenceMember', 'description': 'Channel for sunbird dev',
                    'index': null, 'status': null, 'depth': null, 'mimeType': null, 'visibility': null, 'compatibilityLevel': null
                },
                {
                    'identifier': 'in.ekstep', 'name': 'Ekstep', 'objectType': 'Channel',
                    'relation': 'hasSequenceMember', 'description': 'Channel for in.ekstep',
                    'index': null, 'status': null, 'depth': null, 'mimeType': null, 'visibility': null, 'compatibilityLevel': null
                }],
                'appId': 'ekstep_portal',
                'name': 'NCF framework',
                'lastUpdatedOn': '2018-04-11T06:11:01.978+0000',
                'categories': [
                    {
                        'identifier': 'ncf_board',
                        'code': 'board',
                        'terms': [{
                            'associations': [{
                                'identifier': 'ncf_gradelevel_kindergarten', 'code': 'kindergarten',
                                'name': 'Kindergarten', 'description': '', 'category': 'gradeLevel',
                                'status': 'Live'
                            }, {
                                'identifier': 'ncf_gradelevel_grade1', 'code': 'grade1',
                                'name': 'Grade 1', 'description': '', 'category': 'gradeLevel', 'status': 'Live'
                            },
                            {
                                'identifier': 'ncf_gradelevel_grade2', 'code': 'grade2', 'name': 'Grade 2',
                                'description': '', 'category': 'gradeLevel', 'status': 'Live'
                            },
                            {
                                'identifier': 'ncf_gradelevel_grade4', 'code': 'grade4', 'name': 'Grade 4',
                                'description': '', 'category': 'gradeLevel', 'status': 'Live'
                            },
                            {
                                'identifier': 'ncf_gradelevel_grade3', 'code': 'grade3', 'name': 'Grade 3',
                                'description': '', 'category': 'gradeLevel', 'status': 'Live'
                            },
                            {
                                'identifier': 'ncf_gradelevel_grade5', 'code': 'grade5', 'name': 'Grade 5',
                                'description': '', 'category': 'gradeLevel', 'status': 'Live'
                            }],
                            'identifier': 'ncf_board_ncert', 'code': 'ncert', 'name': 'NCERT',
                            'description': '', 'index': 1, 'category': 'board', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_board_cbse', 'code': 'cbse', 'name': 'CBSE', 'description': '',
                            'index': 2, 'category': 'board', 'status': 'Live'
                        }, {
                            'identifier': 'ncf_board_icse',
                            'code': 'icse', 'name': 'ICSE', 'description': '', 'index': 3, 'category': 'board',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_board_upboard', 'code': 'upboard',
                            'name': 'UP Board', 'description': '', 'index': 4, 'category': 'board', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_board_apboard', 'code': 'apboard', 'name': 'AP Board', 'description': '',
                            'index': 5, 'category': 'board', 'status': 'Live'
                        }, {
                            'identifier': 'ncf_board_tnboard',
                            'code': 'tnboard',
                            'name': 'TN Board', 'description': '', 'index': 6, 'category': 'board', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_board_ncte', 'code': 'ncte', 'name': 'NCTE', 'description': '',
                            'index': 7, 'category': 'board', 'status': 'Live'
                        }, {
                            'identifier': 'ncf_board_mscert',
                            'code': 'mscert', 'name': 'MSCERT', 'description': '', 'index': 8, 'category': 'board',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_board_bser', 'code': 'bser', 'name': 'BSER',
                            'description': '', 'index': 9, 'category': 'board', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_board_others', 'code': 'others', 'name': 'Others',
                            'description': 'others', 'index': 10, 'category': 'board', 'status': 'Live'
                        }],
                        'name': 'Curriculum',
                        'description': '',
                        'index': 1,
                        'status': 'Live'
                    },
                    {
                        'identifier': 'ncf_gradelevel',
                        'code': 'gradeLevel',
                        'terms': [{
                            'identifier': 'ncf_gradelevel_kindergarten',
                            'code': 'kindergarten', 'name': 'Kindergarten',
                            'description': '', 'index': 1, 'category': 'gradeLevel',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_gradelevel_grade1',
                            'code': 'grade1', 'name': 'Grade 1', 'description': '',
                            'index': 2, 'category': 'gradeLevel', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_gradelevel_grade2', 'code': 'grade2',
                            'name': 'Grade 2', 'description': '', 'index': 3,
                            'category': 'gradeLevel', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_gradelevel_grade3',
                            'code': 'grade3', 'name': 'Grade 3',
                            'description': '', 'index': 4, 'category': 'gradeLevel',
                            'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_gradelevel_grade4',
                            'code': 'grade4', 'name': 'Grade 4',
                            'description': '', 'index': 5, 'category': 'gradeLevel',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_gradelevel_grade5',
                            'code': 'grade5', 'name': 'Grade 5', 'description': '',
                            'index': 6, 'category': 'gradeLevel', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_gradelevel_grade6', 'code': 'grade6',
                            'name': 'Grade 6', 'description': '', 'index': 7,
                            'category': 'gradeLevel', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_gradelevel_grade7', 'code': 'grade7',
                            'name': 'Grade 7', 'description': '', 'index': 8,
                            'category': 'gradeLevel', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_gradelevel_grade8', 'code': 'grade8', 'name': 'Grade 8',
                            'description': '', 'index': 9, 'category': 'gradeLevel', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_gradelevel_grade9', 'code': 'grade9', 'name': 'Grade 9',
                            'description': '', 'index': 10, 'category': 'gradeLevel', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_gradelevel_grade10', 'code': 'grade10',
                            'name': 'Grade 10', 'description': '', 'index': 11, 'category': 'gradeLevel',
                            'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_gradelevel_grade11', 'code': 'grade11',
                            'name': 'Grade 11', 'description': '', 'index': 12, 'category': 'gradeLevel',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_gradelevel_grade12', 'code': 'grade12', 'name': 'Grade 12',
                            'description': '', 'index': 13, 'category': 'gradeLevel', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_gradelevel_others', 'code': 'others', 'name': 'Other',
                            'description': '', 'index': 14, 'category': 'gradeLevel', 'status': 'Live'
                        }],
                        'name': 'Class',
                        'description': '',
                        'index': 2,
                        'status': 'Live'
                    },
                    {
                        'identifier': 'ncf_subject', 'code': 'subject',
                        'terms': [{
                            'identifier': 'ncf_subject_mathematics', 'code': 'mathematics',
                            'name': 'Mathematics', 'description': '', 'index': 1, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_english', 'code': 'english',
                            'name': 'English', 'description': '', 'index': 2, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_tamil', 'code': 'tamil',
                            'name': 'Tamil', 'description': '', 'index': 3, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_telugu', 'code': 'telugu',
                            'name': 'Telugu', 'description': '', 'index': 4, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_geography', 'code': 'geography',
                            'name': 'Geography', 'description': '', 'index': 5, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_urdu', 'code': 'urdu',
                            'name': 'Urdu', 'description': '', 'index': 6, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_kannada', 'code': 'kannada',
                            'name': 'Kannada', 'description': '', 'index': 7, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_assamese', 'code': 'assamese',
                            'name': 'Assamese', 'description': '', 'index': 8, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_physics', 'code': 'physics',
                            'name': 'Physics', 'description': '', 'index': 9, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_chemistry', 'code': 'chemistry',
                            'name': 'Chemistry', 'description': '', 'index': 10, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_hindi', 'code': 'hindi',
                            'name': 'Hindi', 'description': '', 'index': 11, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_marathi', 'code': 'marathi',
                            'name': 'Marathi', 'description': '', 'index': 12, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_environmentalstudies',
                            'code': 'environmentalstudies', 'name': 'Environmental Studies', 'description': '',
                            'index': 13, 'category': 'subject', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_subject_politicalscience', 'code': 'politicalscience',
                            'name': 'Political Science', 'description': '', 'index': 14, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_bengali', 'code': 'bengali',
                            'name': 'Bengali', 'description': '', 'index': 15, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_history', 'code': 'history',
                            'name': 'History', 'description': '', 'index': 16, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_gujarati', 'code': 'gujarati',
                            'name': 'Gujarati', 'description': '', 'index': 17, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_biology', 'code': 'biology',
                            'name': 'Biology', 'description': '', 'index': 18, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_oriya', 'code': 'oriya',
                            'name': 'Oriya', 'description': '', 'index': 19, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_punjabi', 'code': 'punjabi',
                            'name': 'Punjabi', 'description': '', 'index': 20, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_nepali', 'code': 'nepali',
                            'name': 'Nepali', 'description': '', 'index': 21, 'category': 'subject',
                            'status': 'Live'
                        }, {
                            'identifier': 'ncf_subject_malayalam', 'code': 'malayalam',
                            'name': 'Malayalam', 'description': '', 'index': 22, 'category': 'subject',
                            'status': 'Live'
                        }], 'name': 'Subject', 'description': '', 'index': 3, 'status': 'Live'
                    }, {
                        'identifier': 'ncf_medium', 'code': 'medium',
                        'terms': [{
                            'identifier': 'ncf_medium_english', 'code': 'english',
                            'name': 'English', 'description': '', 'index': 1,
                            'category': 'medium', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_medium_hindi', 'code': 'hindi',
                            'name': 'Hindi', 'description': '', 'index': 2,
                            'category': 'medium', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_medium_oriya', 'code': 'oriya',
                            'name': 'Oriya', 'description': '', 'index': 3,
                            'category': 'medium', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_medium_telugu', 'code': 'telugu',
                            'name': 'Telugu', 'description': '', 'index': 4,
                            'category': 'medium', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_medium_kannada', 'code': 'kannada',
                            'name': 'Kannada', 'description': '', 'index': 5, 'category': 'medium', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_medium_marathi', 'code': 'marathi',
                            'name': 'Marathi', 'description': '', 'index': 6,
                            'category': 'medium', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_medium_assamese', 'code': 'assamese',
                            'name': 'Assamese', 'description': '', 'index': 7,
                            'category': 'medium', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_medium_bengali', 'code': 'bengali',
                            'name': 'Bengali', 'description': '', 'index': 8,
                            'category': 'medium', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_medium_gujarati', 'code': 'gujarati',
                            'name': 'Gujarati', 'description': '', 'index': 9,
                            'category': 'medium', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_medium_urdu', 'code': 'urdu', 'name': 'Urdu',
                            'description': '', 'index': 10, 'category': 'medium', 'status': 'Live'
                        },
                        {
                            'identifier': 'ncf_medium_other', 'code': 'other', 'name': 'Other',
                            'description': '', 'index': 11, 'category': 'medium', 'status': 'Live'
                        }],
                        'name': 'Medium', 'description': '', 'index': 4, 'status': 'Live'
                    }], 'status': 'Live'
            }
        }
    },
    userSuccess: {

        'lastName': 'User',
        'loginId': 'ntptest102',
        'regOrgId': '0123653943740170242',
        'roles': [
            'public'
        ],
        'rootOrg': {
            'dateTime': null,
            'preferredLanguage': 'English',
            'approvedBy': null,
            'channel': 'ROOT_ORG',
            'description': 'Sunbird',
            'updatedDate': '2017-08-24 06:02:10:846+0000',
            'addressId': null,
            'orgType': null,
            'provider': null,
            'orgCode': 'sunbird',
            'theme': null,
            'id': 'ORG_001',
            'communityId': null,
            'isApproved': null,
            'slug': 'sunbird',
            'identifier': 'ORG_001',
            'thumbnail': null,
            'orgName': 'Sunbird',
            'updatedBy': 'user1',
            'externalId': null,
            'isRootOrg': true,
            'rootOrgId': null,
            'approvedDate': null,
            'imgUrl': null,
            'homeUrl': null,
            'isDefault': null,
            'contactDetail':
                '[{\'phone\':\'213124234234\',\'email\':\'test@test.com\'},{\'phone\':\'+91213124234234\',\'email\':\'test1@test.com\'}]',
            'createdDate': null,
            'createdBy': null,
            'parentOrgId': null,
            'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
            'noOfMembers': 1,
            'status': null
        },
        'identifier': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'profileSummary': 'asdd',
        'tcUpdatedDate': null,
        'avatar': 'https://sunbirddev.blob.core.windows.net/user/874ed8a5-782e-4f6c-8f36-e0288455901e/File-01242833565242982418.png',
        'userName': 'ntptest102',
        'rootOrgId': 'ORG_001',
        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'emailVerified': null,
        'firstName': 'Cretation',
        'lastLoginTime': 1519809987692,
        'createdDate': '2017-10-31 10:47:04:723+0000',
        'createdBy': '5d7eb482-c2b8-4432-bf38-cc58f3c23b45'
    },
    formFieldMetaData: {
        'code': 'board',
        'dataType': 'text',
        'name': 'Board',
        'lable': 'Board',
        'description': 'Education Board (Like MP Board, NCERT, etc)',
        'editable': true,
        'placeholder': 'Board',
        'inputType': 'select',
        'required': false,
        'displayProperty': 'Editable',
        'visible': true,
        'range': [{
            'associations': [{
                'identifier': 'ncf_gradelevel_kindergarten', 'code': 'kindergarten',
                'name': 'Kindergarten', 'description': '', 'category': 'gradeLevel',
                'status': 'Live'
            }, {
                'identifier': 'ncf_gradelevel_grade1', 'code': 'grade1',
                'name': 'Grade 1', 'description': '', 'category': 'gradeLevel', 'status': 'Live'
            },
            {
                'identifier': 'ncf_gradelevel_grade2', 'code': 'grade2', 'name': 'Grade 2',
                'description': '', 'category': 'gradeLevel', 'status': 'Live'
            },
            {
                'identifier': 'ncf_gradelevel_grade4', 'code': 'grade4', 'name': 'Grade 4',
                'description': '', 'category': 'gradeLevel', 'status': 'Live'
            },
            {
                'identifier': 'ncf_gradelevel_grade3', 'code': 'grade3', 'name': 'Grade 3',
                'description': '', 'category': 'gradeLevel', 'status': 'Live'
            },
            {
                'identifier': 'ncf_gradelevel_grade5', 'code': 'grade5', 'name': 'Grade 5',
                'description': '', 'category': 'gradeLevel', 'status': 'Live'
            }]
        }],
        'renderingHints': { 'semanticColumnWidth': 'six' }, 'index': 2,
        'depends': ['gradeLevel']
    },
    onConfigChangeData: {
        field: {
            'code': 'board',
        'dataType': 'text',
        'name': 'Board',
        'lable': 'Board',
        'description': 'Education Board (Like MP Board, NCERT, etc)',
        'editable': true,
        'placeholder': 'Board',
        'inputType': 'select',
        'required': false,
        'displayProperty': 'Editable',
        'visible': true,
        'range': [{
            'associations': [{
                'identifier': 'ncf_gradelevel_kindergarten', 'code': 'kindergarten',
                'name': 'Kindergarten', 'description': '', 'category': 'gradeLevel',
                'status': 'Live'
            }, {
                'identifier': 'ncf_gradelevel_grade1', 'code': 'grade1',
                'name': 'Grade 1', 'description': '', 'category': 'gradeLevel', 'status': 'Live'
            },
            {
                'identifier': 'ncf_gradelevel_grade2', 'code': 'grade2', 'name': 'Grade 2',
                'description': '', 'category': 'gradeLevel', 'status': 'Live'
            },
            {
                'identifier': 'ncf_gradelevel_grade4', 'code': 'grade4', 'name': 'Grade 4',
                'description': '', 'category': 'gradeLevel', 'status': 'Live'
            },
            {
                'identifier': 'ncf_gradelevel_grade3', 'code': 'grade3', 'name': 'Grade 3',
                'description': '', 'category': 'gradeLevel', 'status': 'Live'
            },
            {
                'identifier': 'ncf_gradelevel_grade5', 'code': 'grade5', 'name': 'Grade 5',
                'description': '', 'category': 'gradeLevel', 'status': 'Live'
            }]
        }],
        'renderingHints': { 'semanticColumnWidth': 'six' }, 'index': 2,
        'depends': ['gradeLevel']
        },
        index: '1',
        value: 'NCERT'
    }
};

