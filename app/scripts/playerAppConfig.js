angular.module('playerApp.config', [])
    .constant('config', {

        'URL': {
            'BASE': 'http://localhost:5000/api/sb/v1/',
            'COURSE': {
                'SEARCH': 'course/search',
                'CREATE': 'course/create',
                'UPDATE': 'course/update',
                'REVIEW': 'course/review',
                'PUBLISH': 'course/publish',
                'GET': 'course/get',
                'GET_MY_COURSE': 'course/get/mycourse',
                'HIERARCHY': 'course/hierarchy'
            },
            'CONTENT': {
                'SEARCH': 'content/search',
                'CREATE': 'content/create',
                'UPDATE': 'content/update',
                'REVIEW': 'content/review',
                'PUBLISH': 'content/publish',
                'GET': 'content/get',
                'GET_MY_COURSE': 'content/get/mycontent',
                'UPLOAD': 'content/upload',
                'UPLOAD_MEDIA': 'upload/media'
            },
            'AUTH': {
                'REGISTER': 'user/create',
                'LOGIN': 'user/login'
            },
        },
        'RESPONSE_CODE': {
            CLIENT_ERROR: 'CLIENT_ERROR',
            SERVER_ERROR: 'SERVER_ERROR',
            SUCCESS: 'OK',
            RESOURSE_NOT_FOUND: 'RESOURCE_NOT_FOUND'
        },
        'MESSAGES': {}
    });