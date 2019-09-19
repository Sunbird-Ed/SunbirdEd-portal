export const Response = {
    successData: {
        'name': 'testing1',
        'image': 'http://localhost:9876/http/assets/image1.png',
        'showImage': true,
        'description': 'testing for description',
        'ribbon': {
            'right': { 'class': 'ui blue left ribbon label', 'name': 'story' },
            'left': { 'class': 'ui black right ribbon label', 'name': 'resource' }
        },
        'action': {
            'right': { 'class': 'trash large icon', 'eventName': 'right', 'displayType': 'icon' },
            'left': { 'class': 'ui blue basic button mt-10', 'eventName': 'left', 'displayType': 'button', 'text': 'Resume' }
        }
    },
    defaultData: {
        'name': 'testing2',
        'description': '',
        'showImage': true,
        'ribbon': {
            'right': { 'class': 'ui blue left ribbon label', 'name': 'story' },
            'left': { 'class': 'ui black right ribbon label', 'name': 'resource' }
        }
    },
    cardData: {
        'name': 'B1 Test',
        'description': 'Untitled Collection',
        'action': {
            'right': {
                'class': 'trash large icon',
                'eventName': 'delete',
                'displayType': 'icon'
            },
            'onImage': {
                'eventName': 'onImage'
            }
        },
        'ribbon': {
            'right': {
                'name': 'Worksheet',
                'class': 'ui black right ribbon label'
            }
        },
        'resourceType': 'Worksheet',
        'telemetryInteractEdata': {
            'id': 'draftContentId',
            'type': 'click',
            'pageid': 'DraftContent'
        },
        'telemetryObjectType': 'draft',
        'metaData': {
            'identifier': 'do_1125430645258895361190',
            'mimeType': 'application/vnd.ekstep.content-collection',
            'framework': 'NCFCOPY',
            'contentType': 'TextBook'
        },
        'mimeTypesCount': '{"application/vnd.ekstep.html-archive":32, "video/x-youtube":1}'
    },
    cardDataWithoutYoutubeContent: {
        'name': 'B1 Test',
        'description': 'Untitled Collection',
        'action': {
            'right': {
                'class': 'trash large icon',
                'eventName': 'delete',
                'displayType': 'icon'
            },
            'onImage': {
                'eventName': 'onImage'
            }
        },
        'ribbon': {
            'right': {
                'name': 'Worksheet',
                'class': 'ui black right ribbon label'
            }
        },
        'resourceType': 'Worksheet',
        'telemetryInteractEdata': {
            'id': 'draftContentId',
            'type': 'click',
            'pageid': 'DraftContent'
        },
        'telemetryObjectType': 'draft',
        'metaData': {
            'identifier': 'do_1125430645258895361190',
            'mimeType': 'application/vnd.ekstep.ecml-archive',
            'framework': 'NCFCOPY',
            'contentType': 'Resource'
        }
    },
    librarySearchData: {
        'name': 'Official Textbook',
        'description': 'Untitled Collection',
        'action': {
            'right': {
                'class': 'trash large icon',
                'eventName': 'delete',
                'displayType': 'icon'
            },
            'onImage': {
                'eventName': 'onImage'
            }
        },
        'ribbon': {
            'right': {
                'name': 'TextBook',
                'class': 'ui black right ribbon label'
            },
            'left': {
                'name': 'TextBook',
                'image': 'https://sunbirddev.blob.core.windows.net/badgr/uploads/badges/7f1e949f998d34ed625ebd5480f86904.png',
                'class': 'ui blue left ribbon label'
            },
        },
        'metaData': {
            'identifier': 'do_1125430645258895361190',
            'mimeType': 'application/vnd.ekstep.content-collection',
            'framework': 'NCFCOPY',
            'contentType': 'TextBook'
        }
    },
    emitData: {
        'action': {
            'class': 'trash large icon',
            'eventName': 'delete',
            'displayType': 'icon'
        },
        'data': {
            'name': 'B1 Test',
            'description': 'Untitled Collection',
            'downloadStatus': 'DOWNLOADING',
            'action': {
                'right': {
                    'class': 'trash large icon',
                    'eventName': 'delete',
                    'displayType': 'icon'
                },
                'onImage': {
                    'eventName': 'onImage'
                }
            },
            'ribbon': {
                'right': {
                    'name': 'TextBook',
                    'class': 'ui black right ribbon label'
                }
            },
            'telemetryInteractEdata': {
                'id': 'draftContentId',
                'type': 'click',
                'pageid': 'DraftContent'
            },
            'telemetryObjectType': 'draft',
            'metaData': {
                'identifier': 'do_1125430645258895361190',
                'mimeType': 'application/vnd.ekstep.content-collection',
                'framework': 'NCFCOPY',
                'contentType': 'TextBook'
            }
        }
    }

};
