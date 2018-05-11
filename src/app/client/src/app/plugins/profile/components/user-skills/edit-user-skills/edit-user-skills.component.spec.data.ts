export const mockRes = {
    data: {
        userProfile: {
            'skills': [{
                'skillName': 'angular',
                'addedAt': '2017 - 11 - 22',
                'endorsersList': [{
                    'endorseDate': '2017 - 11 - 22',
                    'userId': 'd5efd1ab - 3cad-4034 - 8143 - 32c480f5cc9e'
                },
                {
                    'endorseDate': '2017 - 12 - 21',
                    'userId': '14df02ff-7e68 - 4c52-a600 - 1b1f30c62ffe'
                }
                ],
                'addedBy': 'd5efd1ab - 3cad-4034 - 8143 - 32c480f5cc9e',
                'endorsementcount': 1,
                'id': 'c8d47393ac484fa5e8ed9c3aa6b3e7d7486979b90a9e9128e0e3bd2037425baf',
                'skillNameToLowercase': 'angular',
                'userId': 'd5efd1ab - 3cad-4034 - 8143 - 32c480f5cc9e',
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
    resourceBundle: {
        'messages': {
            'smsg': {
                'm0038': 'New skill added successfully'
            }
        }
    }
};
