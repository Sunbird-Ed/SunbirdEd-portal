export const mockRes = {
    editorConfig: {
        context: {},
        config: {}
    },
    successResult: {
        'id': 'api.content.read',
        'ver': '1.0',
        'ts': '2021-07-01T11:03:45.354Z',
        'params': {
            'resmsgid': '00ffc2a0-da5c-11eb-8f0d-5b69b763f5d8',
            'msgid': 'd1400790-324e-a5ff-9683-51db545b734c',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'content': {
                'mimeType': 'application/vnd.ekstep.content-collection',
                'objectType': 'Content',
                'primaryCategory': 'Course',
                'contentType': 'Course',
                'identifier': 'do_113312376536465408181',
                'languageCode': [
                    'en'
                ],
                'status': 'Draft',
                'contentDisposition': 'inline',
                'targetFWIds': [
                    'nit_k-12'
                ],
                'framework': 'nit_k-12',
                'createdBy': '5a587cc1-e018-4859-a0a8-e842650b9d64',
                'resourceType': 'Course'
            }
        }
    },
    frameworkSuccessResult: {
        'id': 'api.object.category.definition.read',
        'ver': '3.0',
        'ts': '2021-02-10T09:27:26ZZ',
        'params': {
            'resmsgid': '28c9ff32-dfd5-4e6b-abbc-cecf339dda59',
            'msgid': null,
            'err': null,
            'status': 'successful',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'objectCategoryDefinition': {
                'identifier': 'obj-cat:practice-question-set_questionset_all',
                'objectMetadata': {
                    'config': {
                        'sourcingSettings': {
                            'collection': {
                                'maxDepth': 0,
                                'objectType': 'QuestionSet',
                                'primaryCategory': 'Practice Question Set',
                                'isRoot': true,
                                'iconClass': 'fa fa-book',
                                'children': {
                                    'Question': []
                                },
                                'hierarchy': {}
                            }
                        }
                    },
                    'schema': {
                        'properties': {
                            'mimeType': {
                                'type': 'string',
                                'enum': [
                                    'application/vnd.sunbird.questionset'
                                ]
                            }
                        }
                    }
                },
                'languageCode': [],
                'name': 'Practice Question Set',
            }
        }
    },
    questionsetSuccessResult: {
        'id': 'api.questionset.read',
        'ver': '3.0',
        'ts': '2021-07-01T12:28:24ZZ',
        'params': {
            'resmsgid': 'c5a3bf09-107c-49f4-ab30-0fb1f9914882',
            'msgid': null,
            'err': null,
            'status': 'successful',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'questionset': {
                'mimeType': 'application/vnd.sunbird.questionset',
                'primaryCategory': 'Practice Question Set',
                'contentDisposition': 'inline',
                'identifier': 'do_1133131668609925121264',
                'languageCode': [
                    'en'
                ],
                'framework': 'ekstep_ncert_k-12',
                'createdBy': '5a587cc1-e018-4859-a0a8-e842650b9d64',
                'status': 'Draft'
            }
        }
    },
    getDetailsReturnData: {
        'collectionInfo': {
            'id': 'api.content.read',
            'ver': '1.0',
            'ts': '2021-07-01T15:13:33.408Z',
            'params': {
                'resmsgid': 'e6934e00-da7e-11eb-8f0d-5b69b763f5d8',
                'msgid': 'f4fcb83d-35e9-e31b-557a-46c619bdf29e',
                'status': 'successful',
                'err': null,
                'errmsg': null
            },
            'responseCode': 'OK',
            'result': {
                'content': {
                    'mimeType': 'application/vnd.ekstep.content-collection',
                    'objectType': 'Content',
                    'primaryCategory': 'Course',
                    'contentType': 'Course',
                    'identifier': 'do_113312376536465408181',
                    'languageCode': [
                        'en'
                    ],
                    'status': 'Draft',
                    'contentDisposition': 'inline',
                    'targetFWIds': [
                        'nit_k-12'
                    ],
                    'framework': 'nit_k-12',
                    'createdBy': '5a587cc1-e018-4859-a0a8-e842650b9d64',
                    'resourceType': 'Course'
                }
            }
        },
        'ownershipType': [
            'createdBy',
            'createdFor'
        ]
    },
    lockError: {
        'headers': {
            'normalizedNames': {},
            'lazyUpdate': null
        },
        'status': 400,
        'statusText': 'Bad Request',
        'url': 'http://localhost:3000/content/lock/v1/create',
        'ok': false,
        'name': 'HttpErrorResponse',
        'message': 'Http failure response for http://localhost:3000/content/lock/v1/create: 400 Bad Request',
        'error': {
            'id': 'api.lock.create',
            'ver': '1.0',
            'ts': '2021-07-01T15:33:56.202Z',
            'params': {
                'resmsgid': 'bf6adca0-da81-11eb-8f0d-5b69b763f5d8',
                'msgid': null,
                'status': 'failed',
                'err': 'RESOURCE_SELF_LOCKED',
                'errmsg': 'The resource is already locked by you in a different window/device'
            },
            'responseCode': 'CLIENT_ERROR',
            'result': {}
        }
    },
    getContentSucessRes: {
        'id': 'api.content.read',
        'ver': '1.0',
        'ts': '2021-07-01T15:47:43.281Z',
        'params': {
            'resmsgid': 'ac651a10-da83-11eb-8f0d-5b69b763f5d8',
            'msgid': '2fb8cbe1-f25e-0640-e94c-ba3dbb25faf0',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'content': {
                'mimeType': 'application/vnd.ekstep.content-collection',
                'objectType': 'Content',
                'primaryCategory': 'Course',
                'contentType': 'Course',
                'identifier': 'do_113312376536465408181',
                'status': 'Draft',
                'contentDisposition': 'inline',
                'targetFWIds': [
                    'nit_k-12'
                ],
                'framework': 'nit_k-12',
                'createdBy': '5a587cc1-e018-4859-a0a8-e842650b9d64',
                'resourceType': 'Course'
            }
        }
    },
    categoryRead: {
        'id': 'api.object.category.definition.read',
        'ver': '3.0',
        'ts': '2021-07-01T17:08:11ZZ',
        'params': {
            'resmsgid': '11eb6fbc-a357-4dc2-8a62-4572bd2af643',
            'msgid': null,
            'err': null,
            'status': 'successful',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'objectCategoryDefinition': {
                'identifier': 'obj-cat:course_collection_01309282781705830427',
                'objectMetadata': {
                    'config': {
                        'frameworkMetadata': {
                            'orgFWType': [
                                'K-12',
                                'TPD'
                            ],
                            'targetFWType': [
                                'K-12'
                            ]
                        },
                        'sourcingSettings': {
                            'collection': {
                                'maxDepth': 4,
                                'objectType': 'Collection',
                                'primaryCategory': 'Course',
                                'isRoot': true,
                                'iconClass': 'fa fa-book',
                                'children': {},
                                'hierarchy': {
                                    'level1': {
                                        'name': 'Course Unit',
                                        'type': 'Unit',
                                        'mimeType': 'application/vnd.ekstep.content-collection',
                                        'contentType': 'CourseUnit',
                                        'primaryCategory': 'Course Unit',
                                        'iconClass': 'fa fa-folder-o',
                                        'children': {}
                                    },
                                    'level2': {
                                        'name': 'Course Unit',
                                        'type': 'Unit',
                                        'mimeType': 'application/vnd.ekstep.content-collection',
                                        'contentType': 'CourseUnit',
                                        'primaryCategory': 'Course Unit',
                                        'iconClass': 'fa fa-folder-o',
                                        'children': {
                                            'Content': []
                                        }
                                    },
                                    'level3': {
                                        'name': 'Course Unit',
                                        'type': 'Unit',
                                        'mimeType': 'application/vnd.ekstep.content-collection',
                                        'contentType': 'CourseUnit',
                                        'primaryCategory': 'Course Unit',
                                        'iconClass': 'fa fa-folder-o',
                                        'children': {
                                            'Content': []
                                        }
                                    },
                                    'level4': {
                                        'name': 'Course Unit',
                                        'type': 'Unit',
                                        'mimeType': 'application/vnd.ekstep.content-collection',
                                        'contentType': 'CourseUnit',
                                        'primaryCategory': 'Course Unit',
                                        'iconClass': 'fa fa-folder-o',
                                        'children': {
                                            'Content': []
                                        }
                                    }
                                }
                            }
                        }
                    },
                },
                'languageCode': [],
                'name': 'Course',
            }
        }
    }
};
