export const mockRes = {
    data: {
        userProfile: {
            'address': [{
                'addType': 'current',
                'addressLine1': 'aksdkas',
                'addressLine2': null,
                'city': 'asdasds',
                'country': null,
                'createdBy': '230cb747-6ce9-4e1c-91a8-1067ae291cb9',
                'createdDate': '2018-04-05 13:33:36:909+0000',
                'id': '01247588682584064030',
                'isDeleted': null,
                'state': null,
                'updatedBy': null,
                'updatedDate': null,
                'userId': '230cb747-6ce9-4e1c-91a8-1067ae291cb9',
                'zipcode': null
            }]
        }
    },
    response: {
        'id': 'api.user.update',
        'ver': 'v1',
        'ts': '2018-04-17 15:04:19:235+0000',
        'params': {
            'resmsgid': null,
            'msgid': '4c7397e9-3579-6d38-0751-d90ad4111c2a',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS'
        }
    },
    addressData: {
        'addType': 'current',
        'addressLine1': 'k',
        'addressLine2': 'a',
        'city': 'c',
        'country': 'country',
        'createdBy': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
        'createdDate': '2018-04-17 13:20:37:798+0000',
        'id': '0124843757498531843',
        'isDeleted': true,
        'state': 's',
        'updatedBy': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
        'updatedDate': '2018-04-17 13:24:47:068+0000',
        'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
        'zipcode': '4566'
    },
    resourceBundle: {
        'messages': {
            'fmsg': {
                'm0076': 'Please enter mandatory fields',
                'm0043': 'Address delete failed. Please try again later...'
            },
            'smsg': {
                'm0016': 'Address deleted successfully',
                'm0023': 'Address updated successfully',
                'm0026': 'Address added successfully'
            }
        }
    }
};
