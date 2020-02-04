export const mockRes = {
  inputData: {
    'roles': [
      {
        'id': 1,
        'name': 'CONTRIBUTOR',
        'default': true,
        'defaultTab': 1,
        'tabs': [
          1,
          2
        ]
      },
      {
        'id': 2,
        'name': 'REVIEWER',
        'defaultTab': 1,
        'tabs': [
          2
        ]
      },
      {
        'id': 3,
        'name': 'PUBLISHER',
        'defaultTab': 3,
        'tabs': [
          1,
          3
        ]
      },
      {
        'id': 4,
        'name': 'CERT_ISSUER',
        'defaultTab': 1,
        'tabs': [
          4
        ]
      }
    ],
    'actions': {
      'showTotalContribution': {
        'roles': [
          1,
          2
        ]
      },
      'showMyContribution': {
        'roles': [
          1
        ]
      },
      'showRejected': {
        'roles': [
          1
        ]
      },
      'showUnderReview': {
        'roles': [
          1
        ]
      },
      'showTotalUnderReview': {
        'roles': [
          2
        ]
      },
      'showAcceptedByMe': {
        'roles': [
          2
        ]
      },
      'showRejectedByMe': {
        'roles': [
          2
        ]
      },
      'showFilters': {
        'roles': [
          1,
          2,
          3
        ]
      },
      'addresource': {
        'roles': [
          1
        ]
      },
      'showDashboard': {
        'roles': [
          3
        ]
      },
      'showCert': {
        'roles': [
          4
        ]
      }
    },
    'header': {
      'id': 'ng.sunbird.header',
      'ver': '1.0',
      'compId': 'headerComp',
      'author': 'Venkat',
      'description': '',
      'publishedDate': '',
      'data': '{ }',
      'config': {
        'tabs': [
          {
            'index': 1,
            'label': 'Contribute Questions',
            'onClick': 'collectionComponent',
            'visibility': true
          },
          {
            'index': 2,
            'label': 'Review',
            'onClick': 'dashboardComponent',
            'visibility': true
          },
          {
            'index': 3,
            'label': 'Dashboard',
            'onClick': 'dashboardComponent'
          }
        ]
      }
    },
    'userDetails': {
      'programId': 'b9cf4fa0-f4b5-11e9-a323-3b4a9d67ea97',
      'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
      'enrolledOn': '2019-10-22T10:22:16.941Z',
      'onBoarded': true,
      'onBoardingData': {
        'school': 'DLF Public School (Rajinder Nagar)',
        'class': [
          'Class 1',
          'Class 3',
          'Class 5',
          'Class 7',
          'Class 9',
          'Class 10',
          'Class 11',
          'Class 8'
        ]
      },
      'roles': [
        'CONTRIBUTOR'
      ]
    },
    'showTabs': true
  }
};
