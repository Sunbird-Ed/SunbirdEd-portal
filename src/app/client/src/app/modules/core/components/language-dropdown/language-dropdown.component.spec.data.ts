export const Response = {

    orgResponse: {
        'id': 'api.org.search', 'ver': 'v1', 'ts': '2018-06-07 11:37:12:592+0000',
        'params': {
            'resmsgid': null, 'msgid': '92d0e6ac-24d2-9162-6dc7-3220f71913f3',
            'err': null, 'status': 'success', 'errmsg': null
        }, 'responseCode': 'OK',
        'result': {
            'response': {
                'count': 1, 'content': [{
                    'dateTime': null, 'preferredLanguage': null,
                    'approvedBy': null, 'channel': 'tn', 'description': 'test org description', 'updatedDate': null,
                    'addressId': null, 'orgType': null, 'provider': null, 'orgCode': null, 'theme': null,
                    'id': '0123166374296453124', 'communityId': null, 'isApproved': null, 'slug': 'tn',
                    'identifier': '0123166374296453124', 'thumbnail': null, 'orgName': 'Test Org 1',
                    'updatedBy': null, 'externalId': null, 'isTenant': true, 'rootOrgId': 'ORG_001',
                    'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': null,
                    'createdDate': '2017-08-23 13:38:07:272+0000', 'createdBy': null, 'parentOrgId': null,
                    'hashTagId': '0123166374296453124', 'noOfMembers': null, 'status': null
                }]
            }
        }
    },
    formResponse: {
        'id': 'api.form.read', 'ver': '1.0', 'ts': '2018-06-07T11:37:14.822Z',
        'params': {
            'resmsgid': '20143e60-6a47-11e8-811a-f1c00dbf4c27', 'msgid': '20115830-6a47-11e8-9587-2fafcbd0c4fb',
            'status': 'successful', 'err': null, 'errmsg': null
        }, 'responseCode': 'OK',
        'result': {
            'form': {
                'type': 'content', 'action': 'search', 'subType': 'resourcebundle',
                'rootOrgId': '0123166374296453124', 'framework': 'NCF', 'data': {
                    'templateName': 'defaultTemplate', 'action': 'search',
                    'fields': [{
                        'code': 'portalLanguage', 'dataType': 'text', 'name': 'Portal Language', 'label': 'Portal Language',
                        'description': 'Language that should be displayed on portal (Like English, Hindi etc)',
                        'editable': true, 'inputType': 'select', 'required': false, 'displayProperty': 'Editable',
                        'visible': true, 'renderingHints': { 'semanticColumnWidth': 'four' },
                        'range': [{ 'value': 'en', 'name': 'English' },
                        { 'value': 'ta', 'name': 'Tamil' }, { 'value': 'te', 'name': 'Telugu' }], 'index': 1
                    }]
                }
            }
        }
    }

};

