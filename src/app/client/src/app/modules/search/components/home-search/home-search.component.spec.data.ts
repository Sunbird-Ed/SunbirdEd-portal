export const Response = {
      enrolledCourses: {
        'enrolledCourses': [
            {
                'courseId': 'do_2123412199319552001265', 'courseName': '27-sept',
                'description': 'test', 'leafNodesCount': 0, 'progress': 0, 'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
            }
        ]
    },
    successData: {
      'id': 'api.v1.search',
      'responseCode': 'OK',
      'result': {
        'count': 65,
        'content': [{
          'identifier': 'do_2124339707713126401772',
          'name': 'Test_Collection_19_mar_2018_20001'
        }]
      }
    },
    successDataWithNoCount: {
      'id': 'api.v1.search',
      'responseCode': 'OK',
      'result': {
        'count': 0,
      }
    },
    pager: {
        'totalItems': 1173, 'currentPage': 3, 'pageSize': 25, 'totalPages': 47,
        'startPage': 30, 'endPage': 34, 'startIndex': 725, 'endIndex': 749, 'pages': [30, 31, 32, 33, 34]
    },
    filters: [
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
            'identifier': 'ncf_board_ncert',
            'code': 'ncert',
            'name': 'NCERT',
            'description': '',
            'index': 2,
            'category': 'board',
            'status': 'Live'
          },
          {
            'identifier': 'ncf_board_cbse',
            'code': 'cbse',
            'name': 'CBSE',
            'description': '',
            'index': 1,
            'category': 'board',
            'status': 'Live'
          },
          {
            'identifier': 'ncf_board_icse',
            'code': 'icse',
            'name': 'ICSE',
            'description': '',
            'index': 3,
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
            'identifier': 'ncf_medium_english',
            'code': 'english',
            'name': 'English',
            'description': '',
            'index': 1,
            'category': 'medium',
            'status': 'Live'
          },
          {
            'identifier': 'ncf_medium_hindi',
            'code': 'hindi',
            'name': 'Hindi',
            'description': '',
            'index': 2,
            'category': 'medium',
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
        'index': 3,
        'range': [
          {
            'identifier': 'ncf_subject_mathematics',
            'code': 'mathematics',
            'name': 'Mathematics',
            'description': '',
            'index': 1,
            'category': 'subject',
            'status': 'Live'
          },
          {
            'identifier': 'ncf_subject_english',
            'code': 'english',
            'name': 'English',
            'description': '',
            'index': 2,
            'category': 'subject',
            'status': 'Live'
          }
        ]
      },
      {
        'code': 'gradeLevel',
        'dataType': 'text',
        'name': 'Grade',
        'label': 'Grade',
        'description': 'Grade',
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
            'identifier': 'ncf_gradelevel_kindergarten',
            'code': 'kindergarten',
            'name': 'KG',
            'description': 'KG',
            'index': 1,
            'category': 'gradelevel',
            'status': 'Live'
          },
          {
            'identifier': 'ncf_gradelevel_grade1',
            'code': 'grade1',
            'name': 'Class 1',
            'description': 'Class 1',
            'index': 2,
            'category': 'gradelevel',
            'status': 'Live'
          }
        ]
      }
    ]
  };
