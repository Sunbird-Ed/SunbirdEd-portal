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
                'LOGIN': 'user/login',
                'LOGOUT': 'user/logout'
            },
            "NOTES": {
                "SEARCH": "notes/search",
                "CREATE": "notes/create",
                "UPDATE": "notes/update",
                "GET": "notes/get",
                "DELETE": "notes/delete"
            }
        },
        'RESPONSE_CODE': {
            CLIENT_ERROR: 'CLIENT_ERROR',
            SERVER_ERROR: 'SERVER_ERROR',
            SUCCESS: 'OK',
            RESOURSE_NOT_FOUND: 'RESOURCE_NOT_FOUND'
        },
        'MESSAGES': {
            "NOTES": {
                "CREATE": {
                    "START": "Creating note, please wait...",
                    "FAILED": "Creating note is failed, please try again later...",
                    "SUCCESS": "Note created successfully..."
                },
                "GET": {
                    "START": "Fetching note detail, please wait...",
                    "FAILED": "Fetching note detail is failed, please try again later...",
                    "SUCCESS": "Note detail fetched successfully..."
                },
                "REMOVE": {
                    "START": "Deleting note, please wait...",
                    "FAILED": "Deleting note is failed, please try again later...",
                    "SUCCESS": "Note deleted successfully..."
                },
                "SEARCH": {
                    "START": "Searching notes, please wait...",
                    "FAILED": "Searching note is failed, please try again later...",
                    "SUCCESS": "Note detail fetched successfully..."
                },
                "UPDATE": {
                    "START": "Updating note, please wait...",
                    "FAILED": "Updating note is failed, please try again later...",
                    "SUCCESS": "Note updated successfully..."
                }
            }
        }
    });