export const mockRes = {
    startInputData: {
        'context': {
            'env': 'announcement'
        },
        'object': {
            'id': '34ae4320-388d-11e8-b47d-596d7600c985',
            'type': 'announcement',
            'ver': '1.0'
        },
        'edata': {
            'type': 'workflow',
            'pageid': 'announcement-create',
            'mode': 'create'
        }
    },
    impressionInputData: {
        'context': {
            'env': 'announcement'
        },
        'object': {
            'id': '',
            'type': 'announcement',
            'ver': '1.0'
        },
        'edata': {
            'type': 'announcement',
            'subtype': 'announcement',
            'pageid': 'announcement-create',
            'uri': '/announcement/create'
        }
    },
    interactEventData: {
        'context': {
            'env': 'announcement'
        },
        'object': {
            'id': '',
            'type': 'announcement',
            'ver': '1.0'
        },
        'edata': {
            'id': '123456',
            'pageid': 'announcement-create',
            'type': 'click',
            'subtype': ''
        }
    },
    shareEventData: {
        'context': {
            'env': 'announcement'
        },
        'object': {
            'id': '',
            'type': 'announcement',
            'ver': '1.0'
        },
        'edata': {
            'dir': 'out',
            'type': 'link',
            'items': []
        }

    },
    errorEventData: {
        'context': {
            'env': 'announcement'
        },
        'object': {
            'id': '',
            'type': 'announcement',
            'ver': '1.0'
        },
        'edata': {
            'err': '500',
            'errtype': 'SERVER_ERROR',
            'stacktrace': 'error'
        }
    },
    endEventData: {
        'context': {
            'env': 'announcement'
        },
        'object': {
            'id': '',
            'type': 'announcement',
            'ver': '1.0'
        },
        'edata': {
            'contentId': '34ae4320-388d-11e8-b47d-596d7600c985',
            'pageid': 'announcement-create',
            'type': 'announcement',
            'mode': 'announcement',
            'summary': []
        }
    },
    logEventData: {
        'context': {
            'env': 'announcement'
        },
        'object': {
            'id': '',
            'type': 'announcement',
            'ver': '1.0'
        },
        'edata': {
            'type': 'api_call',
            'level': '1',
            'message': 'api to load inbox'
        }
    },
    userSessionData: {
        'userId': '99733cb8-588a-42af-8161-57e783351a0e'
    }
};
