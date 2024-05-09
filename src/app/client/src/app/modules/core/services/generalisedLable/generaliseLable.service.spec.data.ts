export const MockResponse = {
    resourceBundleConfig: {
        'course': {
            'key': 'crs',
            'trackable': {
                'en': 'all_labels_en.json',
                'hi': 'all_labels_hi.json'
            },
            'nontrackable': {
                'en': 'all_labels_en.json'
            }
        },
        'textbook': {
            'key': 'tbk',
            'trackable': {
                'en': 'all_labels_en.json'
            },
            'nontrackable': {
                'en': 'all_labels_en.json'
            }
        },
        'default': {
            'key': 'dflt',
            'trackable': {
                'en': 'all_labels_en.json'
            },
            'nontrackable': {
                'en': 'all_labels_en.json'
            }
        }
    },
    courseHierarchy: {
        contentType: 'Course',
        primaryCategory: 'Course',
        trackable: { enabled: 'Yes' }
    },
    courseHierarchyNew: {
        contentType: 'Course',
        primaryCategory: 'Course',
        trackable: 'true'
    },
    courseHierarchyone:{
        contentType: 'course',
        primaryCategory: 'course',
    },
    courseHierarchytwo:{
        contentType: 'book',
        primaryCategory: 'book',
    },
    generaliseLblResponse: {
        result:
        {
            'default': {
                'nontrackable': {
                    'en': {
                        'frmelmnts': {
                            'lbl': {
                                'ActivityTextbooks': ' Tasks',
                                'chapter': ' Learning module'
                            }
                        },
                        'messages': {
                            'stmsg': {
                                'm0125': ' Start creating or uploading content. You currently do not have any content saved as a draft'
                            }
                        }
                    }
                },
                'trackable': {
                    'en': {
                        'frmelmnts': {
                            'btn': {
                                'create': ' Create ',
                                'enroll': ' Join'
                            },
                            'tab': {
                                'courses': ' Tasks'
                            }
                        },
                        'messages': {
                            'dashboard': {
                                'emsg': {
                                    'm002': ' User has not joined any batch for this learning task'
                                }
                            }
                        }
                    }
                }
            },
            'course': {
                'nontrackable': {
                    'en': {
                        'frmelmnts': {
                            'lbl': {
                                'ActivityTextbooks': ' Courses',
                                'ACTIVITY_TEXTBOOK_TITLE': ' Courses',
                                'desktop': {
                                    'downloadBook': ' Download course',
                                    'find_more': ' Find more courses and related content on {instance}',
                                    'updateTextbook': ' Update course'
                                },
                                'downloadBooks': ' Download courses to access while offline',
                                'fromTheTextBook': ' from the course',
                                'noBookfoundTitle': ' Board is adding courses',
                                'textbooks': ' Courses',
                                'chapter': ' Course module'
                            }
                        }
                    }
                },
                'trackable': {
                    'en': {
                        'completedCourse': ' Course completed',
                        'frmelmnts': {
                            'btn': {
                                'createCourse': ' Create course'
                            },
                            'lbl': {
                                'accessCourse': ' Access course',
                                'accessToLogin': ' To access the course you have to log in and join the course'
                            }
                        },
                        'messages': {
                            'dashboard': {
                                'emsg': {
                                    'm002': ' The user is not enrolled in any batch of this course'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
