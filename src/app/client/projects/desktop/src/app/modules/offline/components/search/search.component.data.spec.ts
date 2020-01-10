export const filters = [
  {
    'code': 'board',
    'dataType': 'text',
    'name': 'Board/Syllabus',
    'label': 'Board/Syllabus',
    'description': 'Education Board/Syllabus',
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
  }
];

export const searchRequest = {
  'filters': {
    'board': [
      'TEST_BOARD'
    ],
    'contentType': [
      'Collection',
      'TextBook',
      'LessonPlan',
      'Resource'
    ]
  },
  'params': {
    'orgdetails': 'orgName,email',
    'framework': 'TEST',
  },
  'query': 'mathe',
  'facets': [
    'board',
    'medium',
    'gradeLevel',
    'subject',
    'contentType'
  ]
};

export const visitsEvent = {
  visits: [
    {
      'objid': 'do_3125010999257169921165',
      'objtype': 'Resource',
      'index': 0
    },
    {
      'objid': 'do_31254586690550169628776',
      'objtype': 'Resource',
      'index': 1
    }
  ]
};

export const onlineSearchRequest = {
  'filters': {
    'channel': '505c7c48ac6dc1edc9b08f21db5a571d',
    'contentType': [
      'Collection',
      'TextBook',
      'LessonPlan',
      'Resource'
    ]
  },
  'mode': 'soft',
  'params': {
    'orgdetails': 'orgName,email',
    'framework': 'TEST'
  },
  'query': 'test',
  'facets': [
    'board',
    'medium',
    'gradeLevel',
    'subject',
    'contentType'
  ],
  'softConstraints': {
    'badgeAssertions': 98,
    'board': 99,
    'channel': 100
  }
};


