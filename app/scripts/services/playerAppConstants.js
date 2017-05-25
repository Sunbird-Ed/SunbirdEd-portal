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
                'REGISTER': {
                    'START': 'Register in process, please wait...',
                    'FAILED': 'Register failed, please try again later...',
                    'SUCCESS': 'Register successfully...'
                },
                'LOGIN': {
                    'START': 'Login in process, please wait...',
                    'FAILED': 'Login failed, please try again later...',
                    'SUCCESS': 'Login successfully...'
                },
                'LOGOUT': {
                    'START': 'Logout in process, please wait...',
                    'FAILED': 'Logout failed, please try again later...',
                    'SUCCESS': 'Logout successfully...'
                },
            },
        }
    });