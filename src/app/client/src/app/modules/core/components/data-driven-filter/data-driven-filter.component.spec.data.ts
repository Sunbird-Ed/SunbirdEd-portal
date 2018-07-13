export const mockRes = {
    // tslint:disable-next-line:max-line-length
    frameworkData: {
        'err': null,
        'framework': 'NCF',
        'frameworkdata': [
            {
                'identifier': 'ncf_board',
                'code': 'board',
                'terms': [
                    {
                        'associations': [
                            {
                                'identifier': 'ncf_gradelevel_kindergarten',
                                'code': 'kindergarten',
                                'name': 'KG',
                                'description': 'KG',
                                'category': 'gradelevel',
                                'status': 'Live'
                            },
                            {
                                'identifier': 'ncf_gradelevel_grade5',
                                'code': 'grade5',
                                'name': 'Class 5',
                                'description': 'Class 5',
                                'category': 'gradelevel',
                                'status': 'Live'
                            }
                        ],
                        'identifier': 'ncf_board_ncert',
                        'code': 'ncert',
                        'name': 'NCERT',
                        'description': '',
                        'index': 1,
                        'category': 'board',
                        'status': 'Live'
                    },
                    {
                        'identifier': 'ncf_board_cbse',
                        'code': 'cbse',
                        'name': 'CBSE',
                        'description': '',
                        'index': 2,
                        'category': 'board',
                        'status': 'Live'
                    },
                    {
                        'identifier': 'ncf_board_others',
                        'code': 'others',
                        'name': 'Other',
                        'description': 'Other',
                        'index': 10,
                        'category': 'board',
                        'status': 'Live'
                    }
                ],
                'name': 'Curriculum',
                'description': '',
                'index': 1,
                'status': 'Live'
            },
            {
                'identifier': 'ncf_gradelevel',
                'code': 'gradeLevel',
                'terms': [
                    {
                        'identifier': 'ncf_gradelevel_kindergarten',
                        'code': 'kindergarten',
                        'name': 'KG',
                        'description': 'KG',
                        'index': 1,
                        'category': 'gradelevel',
                        'status': 'Live'
                    },
                    {
                        'identifier': 'ncf_gradelevel_others',
                        'code': 'others',
                        'name': 'Other',
                        'description': '',
                        'index': 14,
                        'category': 'gradeLevel',
                        'status': 'Live'
                    }
                ],
                'name': 'Class',
                'description': '',
                'index': 2,
                'status': 'Live'
            },
            {
                'identifier': 'xyz',
                'name': 'Concepts',
                'code': 'concepts',
                'description': '',
                'index': 5,
                'status': 'Live',
                'domains': [
                    {
                        'identifier': 'numeracy',
                        'name': 'Numeracy',
                        'objectType': 'Domain',
                        'children': [
                            {
                                'identifier': 'D5',
                                'name': 'Data Handling',
                                'objectType': 'Dimension',
                                'children': []
                            },
                            {
                                'identifier': 'D1',
                                'name': 'Geometry',
                                'objectType': 'Dimension',
                                'children': []
                            },
                            {
                                'identifier': 'testDimension1',
                                'name': 'Measurement',
                                'objectType': 'Dimension',
                                'children': []
                            },
                            {
                                'identifier': 'D4',
                                'name': 'Measurement',
                                'objectType': 'Dimension',
                                'children': []
                            },
                            {
                                'identifier': 'D2',
                                'name': 'Number sense',
                                'objectType': 'Dimension',
                                'children': [
                                    {
                                        'identifier': 'C6',
                                        'name': 'Counting',
                                        'objectType': 'Concept',
                                        'children': [
                                            {
                                                'identifier': 'C49',
                                                'name': 'Counting objects',
                                                'objectType': 'Concept',
                                                'children': [
                                                    {
                                                        'identifier': 'C211',
                                                        'name': 'Count to 20',
                                                        'objectType': 'Concept',
                                                        'children': [
                                                            {
                                                                'identifier': 'C455',
                                                                'name': 'Learner does not know the order of numbers.',
                                                                'objectType': 'Concept',
                                                                'children': []
                                                            },
                                                            {
                                                                'identifier': 'C456',
                                                                'name': 'Learner.',
                                                                'objectType': 'Concept',
                                                                'children': []
                                                            },
                                                            {
                                                                'identifier': 'C451',
                                                                'name': 'Learner.',
                                                                'objectType': 'Concept',
                                                                'children': []
                                                            },
                                                            {
                                                                'identifier': 'C460',
                                                                'name': 'Learner skips all even numbers while counting.',
                                                                'objectType': 'Concept',
                                                                'children': []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        'identifier': 'C8',
                                        'name': 'Place value',
                                        'objectType': 'Concept',
                                        'children': [
                                            {
                                                'identifier': 'C71',
                                                'name': 'Expand a number with respect to place values',
                                                'objectType': 'Concept',
                                                'children': []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    formConfigData: [
        {
            'code': 'concept',
            'name': 'Concepts',
            'label': 'Concepts',
            'description': 'concept',
            'editable': true,
            'inputType': 'select ',
            'required': false,
            'displayProperty': 'Editable',
            'visible': true, 'renderingHints': { 'semanticColumnWidth': 'four' }, 'index': 5,
            'allowedRoles': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION']
        },
        {
            // tslint:disable-next-line:max-line-length
            'code': 'board', 'name': 'Board', 'label': 'Board', 'description': 'Education Board (Like MP Board, NCERT, etc)', 'editable': true, 'inputType': 'select', 'required': false, 'displayProperty': 'Editable', 'visible': true, 'renderingHints': { 'semanticColumnWidth': 'four' }, 'index': 1,
            'allowedRoles': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION']
        },
        {
            // tslint:disable-next-line:max-line-length
            'code': 'medium', 'name': 'Medium', 'label': 'Medium', 'description': 'Medium of instruction', 'editable': true, 'inputType': 'select', 'required': false, 'displayProperty': 'Editable', 'visible': true, 'renderingHints': { 'semanticColumnWidth': 'four' }, 'index': 4,
            'allowedRoles': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION']
        },
        {
            // tslint:disable-next-line:max-line-length
            'code': 'subject', 'name': 'Subject', 'label': 'Subject', 'description': 'Subject of the Content to use to teach', 'editable': true, 'inputType': 'select', 'required': false, 'displayProperty': 'Editable', 'visible': true, 'renderingHints': { 'semanticColumnWidth': 'four' }, 'index': 2,
            'allowedRoles': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION']
        }],
    formData: [
        {
            'code': 'concepts',
            'dataType': 'text',
            'name': 'Concepts',
            'label': 'Concepts',
            'description': 'concept',
            'editable': true,
            'inputType': 'Concept',
            'required': false,
            'displayProperty': 'Editable',
            'visible': true,
            'renderingHints': {
                'semanticColumnWidth': 'four'
            },
            'index': 6
        },
        {
            'code': 'contentType',
            'dataType': 'text',
            'name': 'Content Types',
            'label': 'Content Types',
            'description': 'Content Types',
            'editable': true,
            'inputType': 'select',
            'required': false,
            'displayProperty': 'Editable',
            'visible': true,
            'range': [
                {
                    'name': 'TextBook'
                },
                {
                    'name': 'Collection'
                },
                {
                    'name': 'LessonPlan'
                },
                {
                    'name': 'Resource'
                }
            ],
            'renderingHints': {
                'semanticColumnWidth': 'four'
            },
            'index': 5
        },
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
                'semanticColumnWidth': 'four'
            },
            'index': 1
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
                'semanticColumnWidth': 'four'
            },
            'index': 2
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
                'semanticColumnWidth': 'four'
            },
            'index': 4
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
                'semanticColumnWidth': 'four'
            },
            'index': 3
        }
    ],
    enrichFilterData: {
        'gradeLevel': [
            {
                'name': 'grade 9',
                'count': 7
            },
            {
                'name': 'kindergarten',
                'count': 268
            },
            {
                'name': 'other',
                'count': 161
            },
            {
                'name': 'class 10',
                'count': 5
            },
            {
                'name': 'class 11',
                'count': 8
            },
            {
                'name': 'class 12',
                'count': 6
            },
            {
                'name': 'grade 1',
                'count': 485
            },
            {
                'name': 'english',
                'count': 1
            },
            {
                'name': 'grade 2',
                'count': 273
            },
            {
                'name': 'grade 3',
                'count': 168
            },
            {
                'name': 'grade 4',
                'count': 151
            },
            {
                'name': 'grade 5',
                'count': 143
            },
            {
                'name': 'kg',
                'count': 94
            },
            {
                'name': 'grade 11',
                'count': 7
            },
            {
                'name': 'grade 6',
                'count': 13
            },
            {
                'name': 'grade 10',
                'count': 7
            },
            {
                'name': 'grade 7',
                'count': 8
            },
            {
                'name': 'grade 8',
                'count': 14
            },
            {
                'name': 'grade 12',
                'count': 8
            },
            {
                'name': 'class 1',
                'count': 178
            },
            {
                'name': 'class 3',
                'count': 33
            },
            {
                'name': 'class 2',
                'count': 85
            },
            {
                'name': 'class 5',
                'count': 32
            },
            {
                'name': 'class 4',
                'count': 23
            },
            {
                'name': 'class 7',
                'count': 6
            },
            {
                'name': 'class 6',
                'count': 7
            },
            {
                'name': 'class 9',
                'count': 5
            },
            {
                'name': 'class 8',
                'count': 9
            }
        ],
        'subject': [
            {
                'name': 'chemistry',
                'count': 2
            },
            {
                'name': 'biology',
                'count': 5
            },
            {
                'name': 'mathematics',
                'count': 83
            },
            {
                'name': 'maths',
                'count': 2
            },
            {
                'name': 'punjabi',
                'count': 2
            },
            {
                'name': 'gujarati',
                'count': 8
            },
            {
                'name': 'kannada',
                'count': 6
            },
            {
                'name': 'history',
                'count': 1
            },
            {
                'name': 'assamese',
                'count': 13
            },
            {
                'name': 'literacy',
                'count': 80
            },
            {
                'name': 'marathi',
                'count': 9
            },
            {
                'name': 'tamil',
                'count': 7
            },
            {
                'name': 'malayalam',
                'count': 1
            },
            {
                'name': 'geography',
                'count': 10
            },
            {
                'name': 'physics',
                'count': 3
            },
            {
                'name': 'english',
                'count': 127
            },
            {
                'name': 'hindi',
                'count': 29
            },
            {
                'name': 'bengali',
                'count': 25
            },
            {
                'name': 'urdu',
                'count': 6
            },
            {
                'name': 'numeracy',
                'count': 1
            },
            {
                'name': 'telugu',
                'count': 4
            },
            {
                'name': 'nepali',
                'count': 2
            },
            {
                'name': 'oriya',
                'count': 2
            }
        ],
        'medium': [
            {
                'name': '',
                'count': 147
            },
            {
                'name': 'gujarati',
                'count': 2
            },
            {
                'name': 'kannada',
                'count': 4
            },
            {
                'name': 'assamese',
                'count': 2
            },
            {
                'name': 'marathi',
                'count': 18
            },
            {
                'name': 'tamil',
                'count': 3
            },
            {
                'name': 'malayalam',
                'count': 1
            },
            {
                'name': 'english',
                'count': 103
            },
            {
                'name': 'hindi',
                'count': 37
            },
            {
                'name': 'bengali',
                'count': 10
            },
            {
                'name': 'telugu',
                'count': 8
            },
            {
                'name': 'nepali',
                'count': 1
            },
            {
                'name': 'odia',
                'count': 12
            }
        ],
        'board': [
            {
                'name': 'state (uttar pradesh)',
                'count': 7
            },
            {
                'name': 'up board',
                'count': 5
            },
            {
                'name': 'mscert',
                'count': 3
            },
            {
                'name': 'tn board',
                'count': 1
            },
            {
                'name': 'state (andhra pradesh)',
                'count': 9
            },
            {
                'name': 'state (maharashtra)',
                'count': 10
            },
            {
                'name': 'icse',
                'count': 24
            },
            {
                'name': 'ncert',
                'count': 104
            },
            {
                'name': 'cbse',
                'count': 69
            },
            {
                'name': 'state (tamil nadu)',
                'count': 5
            }
        ]
    }
};
