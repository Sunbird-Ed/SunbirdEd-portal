export const mockRes = {
    validfile: [{
        name: 'users.csv',
        firstName: 'Vaish',
        lastName: 'M',
        phone: '7899918811',
        email: 'vaish@gmail.com',
        userName: 'vaishnavi',
        password: 'vaish',
        provider: '',
        phoneVerified: '',
        emailVerified: '',
        roles: 'CONTENT_CREATOR',
        position: '',
        grade: '',
        location: '',
        dob: '',
        gender: '',
        language: '',
        profileSummary: '',
        subject: '',
        externalId: 5678,
        organizationId: 9876
    }],
    invalidfile: [{
        name: 'test.png'
    }],
    errorfile: [{
        name: 'user.csv',
        firstName: 'Vaish',
        lastName: 'M',
        userName: 'vaishnavi',
        password: 'vaish',
        subject: ''
    }],
    successResponse: {
        'id': 'api.user.upload',
        'ver': 'v1',
        'ts': '2018-03-23 08:05:31:230+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'cbda6b44-e60f-e0a1-c7b7-0c4ac6ae607f',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'processId': '01246652828212428826',
            'response': 'SUCCESS'
        }
    },
    errorResponse: {
        'id': 'api.user.upload',
        'ver': 'v1',
        'ts': '2018-03-23 08:16:59:649+0000',
        'params': {
            'resmsgid': null,
            'msgid': '55402d80-917f-4f72-9f5b-2e4e7a68ce86',
            'err': 'INVALID_ORGANIZATION_DATA',
            'status': 'INVALID_ORGANIZATION_DATA',
            'errmsg': `Given Organization Data doesn't exist in our records. Please provide a valid one`
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {
        }
    },
    resourceBundle: {
        'messages': {
            'smsg': {
                'm0030': 'Users uploaded successfully'
            },
            'stmsg': {
                'm0080': 'Please upload file in csv formate only'
            },
            'emsg': {
                'm0003': 'You should enter Provider and External Id Or Organization Id'
            }
        }
    }
};
