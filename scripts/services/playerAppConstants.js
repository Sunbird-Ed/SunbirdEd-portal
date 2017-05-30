'use strict';

angular.module('playerApp')
    .constant('playerConstant', {
        'RESPONSE_CODE': {
            CLIENT_ERROR: 'CLIENT_ERROR',
            SERVER_ERROR: 'SERVER_ERROR',
            SUCCESS: 'OK',
            RESOURSE_NOT_FOUND: 'RESOURCE_NOT_FOUND'
        },

        'MESSAGES': {
            'AUTH': {
                'LOGIN': {
                    'FAILED': 'Login failed, please try again later...',
                },
                'LOGOUT': {
                    'FAILED': 'Logout failed, please try again later...',
                },
            },
        }
    });