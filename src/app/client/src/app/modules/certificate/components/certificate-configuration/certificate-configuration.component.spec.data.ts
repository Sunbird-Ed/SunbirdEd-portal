export const response = {
  mockData : {
    data: [
      {
        'code': 'certTypes',
        'dataType': 'text',
        'name': 'certTypes',
        'label': 'Certificate type',
        'description': 'Select certificate',
        'editable': true,
        'inputType': 'select',
        'required': true,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
          'fieldColumnWidth': 'twelve'
        },
        'range': [
          {
            'type': 'Completion certificate',
            'status': 2
          }
        ],
        'index': 1
      },
      {
        'code': 'issueTo',
        'dataType': 'text',
        'name': 'issueTo',
        'label': 'Issue certificate to',
        'description': 'Select',
        'editable': true,
        'inputType': 'select',
        'required': true,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
          'fieldColumnWidth': 'twelve'
        },
        'range': [
          {
            'type': 'All',
            'rootOrgId': ''
          },
          {
            'type': 'My state teacher',
            'rootOrgId': ''
          }
        ],
        'index': 2
      }
    ]
  },
  criteria: {
    'user': {
      'rootOrgId': 'ORG_001'
    },
    'enrollment': {
      'status': 2
    }
  }
};

