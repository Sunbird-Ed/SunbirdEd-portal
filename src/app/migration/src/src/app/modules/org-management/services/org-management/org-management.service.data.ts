export const mockRes = {
    request: {
        orgdata: [{
            name: 'organizations.csv',
            orgName: 'new org',
            isRootOrg: 'TRUE',
            channel: 'channel110001',
            externalId: 'ugc0001',
            provider: 'technical002',
            description: 'desc',
            homeUrl: 'googlehomeurl',
            orgCode: 'orgcode12345',
            orgType: '',
            preferredLanguage: 'hindi',
            theme: 'goodtheme',
            contactDetail: ''
        }]
    },
    userRequest: {
        userdata: [{
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
        }]
    },
    successBulkStatusResponse: {
        'id': 'api.org.upload',
        'ver': 'v1',
        'ts': '2018-03-25 17:04:28:069+0000',
        'params': {
            'resmsgid': null,
            'msgid': '3a9c76f9-7d08-055e-867b-00301424555d',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'processId': '012465880638177280660',
            'response': 'SUCCESS'
        }
    }
};
