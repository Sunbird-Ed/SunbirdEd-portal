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
