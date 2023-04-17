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
        },
        {
          'trackable': {
              'enabled': 'No',
              'autoBatch': 'No'
          },
          'identifier': 'do_2133455247951380481573',
          'subject': [
              'Accountancy',
              'Biology'
          ],
          'channel': '01329314824202649627',
          'organisation': [
              'CBSE'
          ],
          'mimeType': 'application/vnd.ekstep.content-collection',
          'medium': [
              'English',
              'Hindi'
          ],
          'pkgVersion': 1,
          'objectType': 'Content',
          'gradeLevel': [
              'Class 10',
              'Class 11',
              'Class 1',
              'Class 12',
              'Class 2',
              'Class 3',
              'Class 4',
              'Class 5',
              'Class 6',
              'Class 7',
              'Class 8',
              'Class 9'
          ],
          'appIcon': 'https://sunbirdstagingpublic.blob.core.windows.net/sunbird-content-staging/content/do_2133455247951380481573/artifact/11111_1553061607920.thumb.jpg',
          'primaryCategory': 'Digital Textbook',
          'name': 'Question set offline book test',
          'contentType': 'TextBook',
          'board': 'CBSE',
          'resourceType': 'Book',
          'orgDetails': {
              'email': null,
              'orgName': 'CBSE'
          }
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
    ],
    formData: [{
      'index': 1,
      'title': 'frmelmnts.tab.courses',
      'desc': 'frmelmnts.tab.courses',
      'menuType': 'Content',
      'isEnabled': true,
      'theme': {
        'baseColor': '',
        'textColor': '',
        'supportingColor': ''
      },
      'search': {
        'facets': ['topic', 'purpose', 'medium', 'gradeLevel', 'subject', 'channel'],
        'fields': [],
        'filters': {
          'contentType': ['Course']
        },
        'limit': 20
      }
    }, {
      'index': 0,
      'title': 'frmelmnts.lbl.textbooks',
      'desc': 'frmelmnts.lbl.textbooks',
      'menuType': 'Content',
      'isEnabled': true,
      'theme': {
        'baseColor': '',
        'textColor': '',
        'supportingColor': ''
      },
      'search': {
        'facets': ['board', 'gradeLevel', 'subject', 'medium', 'contentType', 'concepts'],
        'fields': ['name', 'appIcon', 'mimeType', 'gradeLevel', 'identifier', 'medium', 'pkgVersion', 'board', 'subject', 'resourceType', 'contentType', 'channel', 'organisation'],
        'filters': {
          'contentType': ['TextBook']
        },
        'limit': 100
      }
    }, {
      'index': 2,
      'title': 'frmelmnts.tab.all',
      'desc': 'frmelmnts.tab.all',
      'menuType': 'Content',
      'isEnabled': false,
      'theme': {
        'baseColor': '',
        'textColor': '',
        'supportingColor': ''
      },
      'search': {
        'facets': ['board', 'gradeLevel', 'subject', 'medium', 'contentType', 'concepts'],
        'fields': ['name', 'appIcon', 'mimeType', 'gradeLevel', 'identifier', 'medium', 'pkgVersion', 'board', 'subject', 'resourceType', 'contentType', 'channel', 'organisation'],
        'filters': {
          'contentType': ['Collection', 'TextBook', 'LessonPlan', 'Resource', 'SelfAssess', 'PracticeResource', 'LearningOutcomeDefinition', 'ExplanationResource', 'CurriculumCourse', 'Course']
        },
        'limit': 100
      }
    }],
    cachedFilters: {
      'primaryCategory': [
        'course'
      ],
      'se_boards': [
        'CBSE'
      ],
      'se_mediums': [
        'english'
      ],
      'se_gradeLevels': [
        'class 1'
      ],
      'se_subjects': [
        'Accountancy'
      ]
    }
  };
