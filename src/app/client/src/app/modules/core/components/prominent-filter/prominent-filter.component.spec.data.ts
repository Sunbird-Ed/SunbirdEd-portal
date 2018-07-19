export const Response = {
    inputData: ['NCERT',
        'CBSE',
        'ICSE',
        'State (Uttar Pradesh)' ,
        'State (Andhra Pradesh)' ,
        'State (Tamil Nadu)',
        'NCTE',
        'State (Maharashtra)',
        'State (Rajasthan)',
        'Other'],
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
            'code': 'board', 'name': 'Board', 'label': 'Board',
            'description': 'Education Board (Like MP Board, NCERT, etc)',
            'editable': true, 'inputType': 'select', 'required': false,
            'displayProperty': 'Editable', 'visible': true, 'renderingHints': { 'semanticColumnWidth': 'four' }, 'index': 1,
            'allowedRoles': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION']
        },
        {
            'code': 'medium', 'name': 'Medium', 'label': 'Medium',
             'description': 'Medium of instruction', 'editable': true,
             'inputType': 'select', 'required': false, 'displayProperty': 'Editable',
              'visible': true, 'renderingHints': { 'semanticColumnWidth': 'four' }, 'index': 4,
            'allowedRoles': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION']
        },
        {
            'code': 'subject', 'name': 'Subject', 'label': 'Subject',
             'description': 'Subject of the Content to use to teach',
              'editable': true, 'inputType': 'select', 'required': false,
              'displayProperty': 'Editable', 'visible': true,
              'renderingHints': { 'semanticColumnWidth': 'four' }, 'index': 2,
            'allowedRoles': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION']
        }],
    formData: [
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
};
