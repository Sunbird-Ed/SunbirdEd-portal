export const response = {
    orgData: {
        'dateTime': null,
        'preferredLanguage': null,
        'approvedBy': null,
        'channel': 'ROOT_ORG',
        'description': 'Test',
        'updatedDate': '2017-08-25 06:56:00:887+0000',
        'addressId': null,
        'provider': null,
        'locationId': null,
        'orgCode': 'ABC',
        'theme': null,
        'id': 'ORG_001',
        'communityId': null,
        'isApproved': null,
        'email': null,
        'slug': 'ABC',
        'identifier': 'ORG_001',
        'thumbnail': null,
        'orgName': 'ABC',
        'updatedBy': 'user1',
        'locationIds': [],
        'externalId': null,
        'isRootOrg': true,
        'rootOrgId': null,
        'approvedDate': null,
        'imgUrl': null,
        'homeUrl': null,
        'orgTypeId': null,
        'isDefault': true,
        'contactDetail': null,
        'createdDate': null,
        'createdBy': null,
        'parentOrgId': null,
        'hashTagId': '1234',
        'noOfMembers': 1,
        'status': 1
    },
    filtersData: [{
        'code': 'board',
        'dataType': 'text',
        'name': 'Board/Syllabus',
        'label': 'Board/Syllabus',
        'description': 'Education Board/Syllabus',
        'editable': true,
        'inputType': 'select',
        'required': false,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
            'semanticColumnWidth': 'three'
        },
        'index': 1,
        'range': [{
            'identifier': 'test_board_1',
            'code': 'test_board',
            'translations': null,
            'name': 'TEST_BOARD',
            'description': '',
            'index': 1,
            'category': 'board',
            'status': 'Live'
        }]
    }, {
        'code': 'medium',
        'dataType': 'text',
        'name': 'Medium',
        'label': 'Medium',
        'description': 'Medium of instruction',
        'editable': true,
        'inputType': 'select',
        'required': false,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
            'semanticColumnWidth': 'three'
        },
        'index': 2,
        'range': [{
            'identifier': 'test_medium_assamese',
            'code': 'test_medium',
            'translations': null,
            'name': 'TEST_MEDIUM',
            'description': '',
            'index': 1,
            'category': 'medium',
            'status': 'Live'
        }]
    }, {
        'code': 'gradeLevel',
        'dataType': 'text',
        'name': 'Class',
        'label': 'Class',
        'description': 'Grade',
        'editable': true,
        'inputType': 'select',
        'required': false,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
            'semanticColumnWidth': 'three'
        },
        'index': 3,
        'range': [{
            'identifier': 'test_gradelevel_kindergarten',
            'code': 'kindergarten',
            'translations': null,
            'name': 'KG',
            'description': 'KG',
            'index': 1,
            'category': 'gradelevel',
            'status': 'Live'
        }]
    }, {
        'code': 'subject',
        'dataType': 'text',
        'name': 'Subject',
        'label': 'Subject',
        'description': 'Subject of the Content to use to teach',
        'editable': true,
        'inputType': 'select',
        'required': false,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
            'semanticColumnWidth': 'three'
        },
        'index': 4,
        'range': [{
            'identifier': 'test_subject_accountancy',
            'code': 'accountancy',
            'translations': null,
            'name': 'Accountancy',
            'description': 'Accountancy',
            'index': 1,
            'category': 'subject',
            'status': 'Live'
        }]
    }, {
        'code': 'contentType',
        'dataType': 'text',
        'name': 'Content Types',
        'label': 'Content Types',
        'description': 'Content Types',
        'editable': true,
        'inputType': 'select',
        'required': false,
        'displayProperty': 'Editable',
        'visible': true,
        'range': [{
            'name': 'TextBook'
        }, {
            'name': 'Collection'
        }, {
            'name': 'LessonPlan'
        }, {
            'name': 'Resource'
        }],
        'renderingHints': {
            'semanticColumnWidth': 'four'
        },
        'index': 5
    }]
};

export const hoverActionEvent = {
    'event': {
        'isTrusted': true
    },
    'hover': {
        'type': 'save',
        'label': 'Save to Pendrive',
        'disabled': false
    },
    'content': {
        'name': 'Copy of Math_testprep_grade10',
        'image': 'content/do_31288771643112652813019/notebook_1491393332116.thumb.png',
        'description': 'Enter description for TextBook',
        'rating': 3,
        'subject': 'Assamese (Angkuran)',
        'medium': 'Assamese',
        'orgDetails': {},
        'gradeLevel': 'Class 7',
        'contentType': 'TextBook',
        'topic': '',
        'subTopic': '',
        'metaData': {
            'identifier': 'do_31288771643112652813019',
            'mimeType': 'application/vnd.ekstep.content-collection',
            'framework': 'as_k-12',
            'contentType': 'TextBook'
        },
        'completionPercentage': 0,
        'mimeTypesCount':
            '{"application/pdf":7,"application/vnd.ekstep.content-collection":19,"application/vnd.ekstep.ecml-archive":4,"video/mp4":7}',
        'cardImg': 'content/do_31288771643112652813019/notebook_1491393332116.thumb.png',
        'resourceType': 'Book',
        'organisation': [
            'DIKSHA Support'
        ],
        'hoverData': {
            'note': '',
            'actions': [
                {
                    'type': 'save',
                    'label': 'Save to Pendrive',
                    'disabled': false
                },
                {
                    'type': 'open',
                    'label': 'Open'
                }
            ]
        },
        'ribbon': {
            'left': {},
            'right': {
                'name': 'Book'
            }
        }
    }
};

export const downloadList = {
    'id': 'api.content.download.list',
    'ver': '1.0',
    'ts': '2019-12-23T10:49:21.097Z',
    'params': {
        'resmsgid': '1a480c63-ae78-4fdb-8b65-0c83a0ec038d',
        'msgid': '32581d2f-0d58-4a4a-a4c5-aabd0a46a211',
        'status': 'successful',
        'err': null,
        'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
        'response': {
            'contents': [
                {
                    'id': 'c58ccddb-2388-4a1d-8a6f-59c2928fb6c8',
                    'contentId': 'do_31254586690550169628776',
                    'resourceId': 'do_31254586690550169628776',
                    'mimeType': 'application/pdf',
                    'name': 'test',
                    'status': 'inQueue',
                    'createdOn': 1577098160873,
                    'pkgVersion': 2,
                    'contentType': 'Resource',
                    'totalSize': 412759,
                    'addedUsing': 'download'
                },
                {
                    'id': 'd77edf92-1a18-41aa-8a48-72d410e97f92',
                    'contentId': 'do_3126224885317877761111',
                    'resourceId': 'do_3126224885317877761111',
                    'mimeType': 'application/vnd.ekstep.ecml-archive',
                    'name': 'SSLC SCIENCE EM PART A 165 QUESTIONS TEST',
                    'status': 'completed',
                    'createdOn': 1577080964570,
                    'pkgVersion': 2,
                    'contentType': 'Resource',
                    'totalSize': 460203,
                    'addedUsing': 'download'
                },
                {
                    'id': '2c18608e-e9c2-46ed-bec4-0a456b3f7d4d',
                    'contentId': 'do_31266840654472806413459',
                    'resourceId': 'do_31266840654472806413459',
                    'mimeType': 'video/x-youtube',
                    'name': 'Color Blind Test | Amazing Tricks | Science | LetsTute',
                    'status': 'completed',
                    'createdOn': 1577080944363,
                    'pkgVersion': 1,
                    'contentType': 'Resource',
                    'totalSize': 37138,
                    'addedUsing': 'download'
                },
                {
                    'id': '9b7681bf-3014-4a00-adfe-89f77654aff3',
                    'contentId': 'do_3125010999257169921165',
                    'resourceId': 'do_3125010999257169921165',
                    'mimeType': 'application/vnd.ekstep.html-archive',
                    'name': 'PHET Simulations Test',
                    'status': 'completed',
                    'createdOn': 1577080942231,
                    'pkgVersion': 2,
                    'contentType': 'Resource',
                    'totalSize': 78660,
                    'addedUsing': 'download'
                }
            ]
        }
    }
};

export const contentList = [
    {
        'name': 'PHET Simulations Test',
        'image': 'content/do_3125010999257169921165/correct_1515820207913.png',
        'description': 'In this content, you will see the PHET simulations related to weights and balances.',
        'rating': '0',
        'subject': 'Physics',
        'medium': 'English',
        'orgDetails': {},
        'gradeLevel': 'Other',
        'contentType': 'Resource',
        'topic': '',
        'subTopic': '',
        'metaData': {
            'identifier': 'do_3125010999257169921165',
            'mimeType': 'application/vnd.ekstep.html-archive',
            'framework': 'NCF',
            'contentType': 'Resource'
        },
        'completionPercentage': 0,
        'mimeTypesCount': 0,
        'cardImg': 'content/do_3125010999257169921165/correct_1515820207913.png',
        'resourceType': 'Experiment',
        'hoverData': {
            'note': '',
            'actions': [
                {
                    'type': 'save',
                    'label': 'Save to Pendrive',
                    'disabled': false
                },
                {
                    'type': 'open',
                    'label': 'Open'
                }
            ]
        },
        'action': {
            'onImage': {
                'eventName': 'onImage'
            }
        },
        'ribbon': {
            'left': {
                'class': 'ui circular label  card-badges-image'
            },
            'right': {
                'name': 'Experiment',
                'class': 'ui black right ribbon label'
            }
        }
    },
    {
        'name': 'SSLC SCIENCE EM PART A 165 QUESTIONS TEST',
        'image': 'content/do_3126224885317877761111/assets10science4_3_9292_1538236353_1538236353230.thumb.jpg',
        'description': 'SAMACHEER KALVI TAMIL NADU STATE BOARD SCIENCE EM ANY 165 ONE MARKS TEST PART A QUESTIONS OUT OF 170 QUESTIONS',
        'rating': '0',
        'subject': 'Physics',
        'orgDetails': {},
        'gradeLevel': 'Class 10',
        'contentType': 'Resource',
        'topic': '',
        'subTopic': '',
        'metaData': {
            'identifier': 'do_3126224885317877761111',
            'mimeType': 'application/vnd.ekstep.ecml-archive',
            'framework': 'NCF',
            'contentType': 'Resource'
        },
        'completionPercentage': 0,
        'mimeTypesCount': 0,
        'cardImg': 'content/do_3126224885317877761111/assets10science4_3_9292_1538236353_1538236353230.thumb.jpg',
        'resourceType': 'Test',
        'hoverData': {
            'note': '',
            'actions': [
                {
                    'type': 'save',
                    'label': 'Save to Pendrive',
                    'disabled': false
                },
                {
                    'type': 'open',
                    'label': 'Open'
                }
            ]
        },
        'action': {
            'onImage': {
                'eventName': 'onImage'
            }
        },
        'ribbon': {
            'left': {
                'class': 'ui circular label  card-badges-image'
            },
            'right': {
                'name': 'Test',
                'class': 'ui black right ribbon label'
            }
        }
    },
    {
        'name': 'Color Blind Test | Amazing Tricks | Science | LetsTute',
        'image': 'content/do_31266840654472806413459/color-blind_1546437156540.thumb.jpg',
        'description': 'This video covers :\nColors are beautiful & so are the eyes that help us see this colorful world',
        'rating': '0',
        'subject': 'Science',
        'medium': 'English',
        'orgDetails': {},
        'gradeLevel': 'Class 9,Class 10',
        'contentType': 'Resource',
        'topic': '',
        'subTopic': '',
        'metaData': {
            'identifier': 'do_31266840654472806413459',
            'mimeType': 'video/x-youtube',
            'framework': 'NCF',
            'contentType': 'Resource'
        },
        'completionPercentage': 0,
        'mimeTypesCount': 0,
        'cardImg': 'content/do_31266840654472806413459/color-blind_1546437156540.thumb.jpg',
        'resourceType': 'Learn',
        'organisation': [
            'Universal Learning Aid (Let\'s Tute)'
        ],
        'hoverData': {
            'note': '',
            'actions': [
                {
                    'type': 'save',
                    'label': 'Save to Pendrive',
                    'disabled': false
                },
                {
                    'type': 'open',
                    'label': 'Open'
                }
            ]
        },
        'action': {
            'onImage': {
                'eventName': 'onImage'
            }
        },
        'ribbon': {
            'left': {
                'class': 'ui circular label  card-badges-image'
            },
            'right': {
                'name': 'Learn',
                'class': 'ui black right ribbon label'
            }
        }
    },
    {
        'name': 'Copy of Math_testprep_grade10',
        'image': 'content/do_31288771643112652813019/notebook_1491393332116.thumb.png',
        'description': 'Enter description for TextBook',
        'rating': 3,
        'subject': 'Assamese (Angkuran)',
        'medium': 'Assamese',
        'orgDetails': {},
        'gradeLevel': 'Class 7',
        'contentType': 'TextBook',
        'topic': '',
        'subTopic': '',
        'metaData': {
            'identifier': 'do_31288771643112652813019',
            'mimeType': 'application/vnd.ekstep.content-collection',
            'framework': 'as_k-12',
            'contentType': 'TextBook'
        },
        'completionPercentage': 0,
        'mimeTypesCount':
            '{"application/pdf":7,"application/vnd.ekstep.content-collection":19,"application/vnd.ekstep.ecml-archive":4,"video/mp4":7}',
        'cardImg': 'content/do_31288771643112652813019/notebook_1491393332116.thumb.png',
        'resourceType': 'Book',
        'organisation': [
            'DIKSHA Support'
        ],
        'hoverData': {
            'note': '',
            'actions': [
                {
                    'type': 'save',
                    'label': 'Save to Pendrive',
                    'disabled': false
                },
                {
                    'type': 'open',
                    'label': 'Open'
                }
            ]
        },
        'action': {
            'onImage': {
                'eventName': 'onImage'
            }
        },
        'ribbon': {
            'left': {
                'class': 'ui circular label  card-badges-image'
            },
            'right': {
                'name': 'Book',
                'class': 'ui black right ribbon label'
            }
        }
    }
];

export const appTelemetryInteractData = {
    'context': {
        'env': 'browse',
        'cdata': [
            {
                'id': 'do_3125010999257169921165',
                'type': 'Resource'
            }
        ]
    },
    'edata': {
        'id': 'play-content',
        'type': 'click',
        'pageid': 'library'
    },
    'object': {
        'id': 'do_3125010999257169921165',
        'type': 'Resource',
        'ver': '1.0'
    }
};
