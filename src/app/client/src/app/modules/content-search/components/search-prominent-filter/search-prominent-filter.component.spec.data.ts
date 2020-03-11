export const formatedFilterDetails = [
    {
        'code': 'board',
        'dataType': 'text',
        'name': 'Board',
        'label': 'Board',
        'description': 'Education Board (Like MP Board, NCERT, etc)',
        'editable': true,
        'inputType': 'select',
        'required': false,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
            'semanticColumnWidth': 'three'
        },
        'index': 1,
        'range': [
            {
                'identifier': 'test_board_1',
                'code': 'test_board',
                'translations': null,
                'name': 'TEST_BOARD',
                'description': '',
                'index': 1,
                'category': 'board',
                'status': 'Live'
            }
        ]
    },
    {
        'code': 'medium',
        'dataType': 'text',
        'name': 'Medium',
        'label': 'Medium',
        'description': 'Medium of instruction',
        'editable': true,
        'inputType': 'select',
        'required': false,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
            'semanticColumnWidth': 'three'
        },
        'index': 2,
        'range': [
            {
                'identifier': 'test_medium_assamese',
                'code': 'test_medium',
                'translations': null,
                'name': 'TEST_MEDIUM',
                'description': '',
                'index': 1,
                'category': 'medium',
                'status': 'Live'
            }
        ]
    },
    {
        'code': 'gradeLevel',
        'dataType': 'text',
        'name': 'Class',
        'label': 'Class',
        'description': 'Grade',
        'editable': true,
        'inputType': 'select',
        'required': false,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
            'semanticColumnWidth': 'three'
        },
        'index': 3,
        'range': [
            {
                'identifier': 'test_gradelevel_kindergarten',
                'code': 'kindergarten',
                'translations': null,
                'name': 'KG',
                'description': 'KG',
                'index': 1,
                'category': 'gradelevel',
                'status': 'Live'
            }
        ]
    },
    {
        'code': 'subject',
        'dataType': 'text',
        'name': 'Subject',
        'label': 'Subject',
        'description': 'Subject of the Content to use to teach',
        'editable': true,
        'inputType': 'select',
        'required': false,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
            'semanticColumnWidth': 'three'
        },
        'index': 4,
        'range': [
            {
                'identifier': 'test_subject_accountancy',
                'code': 'accountancy',
                'translations': null,
                'name': 'Accountancy',
                'description': 'Accountancy',
                'index': 1,
                'category': 'subject',
                'status': 'Live'
            }
        ]
    }
];

export const frameworkDetails = {
    'err': null,
    'frameworkdata': {
        'defaultFramework': {
            'identifier': 'TEST',
            'code': 'TEST',
            'name': 'TEST framework',
            'description': 'TEST Framework',
            'graph_id': 'domain',
            'nodeType': 'DATA_NODE',
            'type': 'K-12',
            'node_id': 254434,
            'objectType': 'Framework',
            'categories': [
                {
                    'identifier': 'test_board',
                    'code': 'board',
                    'terms': [
                        {
                            'identifier': 'test_board_1',
                            'code': 'test_board',
                            'translations': null,
                            'name': 'TEST_BOARD',
                            'description': '',
                            'index': 1,
                            'category': 'board',
                            'status': 'Live'
                        }
                    ],
                    'translations': null,
                    'name': 'Board',
                    'description': '',
                    'index': 1,
                    'status': 'Live'
                },
                {
                    'identifier': 'test_medium',
                    'code': 'medium',
                    'terms': [
                        {
                            'identifier': 'test_medium_assamese',
                            'code': 'test_medium',
                            'translations': null,
                            'name': 'TEST_MEDIUM',
                            'description': '',
                            'index': 1,
                            'category': 'medium',
                            'status': 'Live'
                        }
                    ],
                    'translations': null,
                    'name': 'Medium',
                    'description': '',
                    'index': 2,
                    'status': 'Live'
                },
                {
                    'identifier': 'test_gradelevel',
                    'code': 'gradeLevel',
                    'terms': [
                        {
                            'identifier': 'test_gradelevel_kindergarten',
                            'code': 'kindergarten',
                            'translations': null,
                            'name': 'KG',
                            'description': 'KG',
                            'index': 1,
                            'category': 'gradelevel',
                            'status': 'Live'
                        }
                    ],
                    'translations': null,
                    'name': 'Class',
                    'description': '',
                    'index': 3,
                    'status': 'Live'
                },
                {
                    'identifier': 'test_subject',
                    'code': 'subject',
                    'terms': [
                        {
                            'identifier': 'test_subject_accountancy',
                            'code': 'accountancy',
                            'translations': null,
                            'name': 'Accountancy',
                            'description': 'Accountancy',
                            'index': 1,
                            'category': 'subject',
                            'status': 'Live'
                        }
                    ],
                    'translations': null,
                    'name': 'Subject',
                    'description': '',
                    'index': 4,
                    'status': 'Live'
                },
                {
                    'identifier': 'test_topic',
                    'code': 'topic',
                    'terms': [
                        {
                            'identifier': 'test_topic_da698168fcfe00dff93f32e7f42dc3ddce03c082',
                            'code': 'da698168fcfe00dff93f32e7f42dc3ddce03c082',
                            'children': [
                                {
                                    'identifier': 'test_topic_d01d9205a153e0d27b2cf8505d2faaa0ae63cb25',
                                    'code': 'd01d9205a153e0d27b2cf8505d2faaa0ae63cb25',
                                    'translations': null,
                                    'name': 'Family Members',
                                    'description': 'Family Members',
                                    'index': 1,
                                    'category': 'topic',
                                    'status': 'Live'
                                }
                            ],
                            'translations': null,
                            'name': 'My Family and me',
                            'description': 'My Family and me',
                            'index': 1,
                            'category': 'topic',
                            'status': 'Live'
                        }
                    ],
                    'translations': null,
                    'name': 'Topic',
                    'description': 'Concepts',
                    'index': 5,
                    'status': 'Live'
                }
            ]
        }
    }
};
