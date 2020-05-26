export const onboardingLocationMockData = {
  eventObject: {
    target: {
      value: {}
    }
  },
  stateList: [
    {
      code: '1',
      name: 'Maharashtra',
      id: '3789e5e3-a31f-43fa-9cb3-c1b26460fff3',
      type: 'state'
    },
    {
      code: '2',
      name: 'Himachal Pradesh',
      id: '3789e5e3-a31f-43fa-9cb3-c1b26460fff3',
      type: 'state'
    },
  ],
  districtList: [{
    'code': '2725',
    'name': 'Pune',
    'id': '34b8ac6b-d6c9-4ab1-9fd0-cfb0ec1a2a81',
    'type': 'district',
    'parentId': '37809706-8f0e-4009-bf67-87bf04f220fa'
  },
  {
    'code': '2724',
    'name': 'Raigad',
    'id': '9ab6d64a-1db0-47a6-81df-fa1a360c6802',
    'type': 'district',
    'parentId': '37809706-8f0e-4009-bf67-87bf04f220fa'
  }],
  telemetryData: {
    locationIntractEdata: {
      id: 'submit-clicked',
      type: 'location-unchanged',
      subtype: ''
    },
    telemetryCdata: [
      { id: 'user:state:districtConfirmation', type: 'Feature' },
      { id: 'SH-40', type: 'Task' }
    ]
  },
  stateChanged: {
    locationIntractEdata: {
      id: 'submit-clicked',
      type: 'location-changed',
      subtype: 'state-changed'
    },
    telemetryCdata: [
      { id: 'user:state:districtConfirmation', type: 'Feature' },
      { id: 'SC-1373', type: 'Task' }
    ]
  },
  districtChanged: {
    locationIntractEdata: {
      id: 'submit-clicked',
      type: 'location-changed',
      subtype: 'dist-changed'
    },
    telemetryCdata: [
      { id: 'user:state:districtConfirmation', type: 'Feature' },
      { id: 'SC-1373', type: 'Task' }
    ]
  },
  bothChanged: {
    locationIntractEdata: {
      id: 'submit-clicked',
      type: 'location-changed',
      subtype: 'state-dist-changed'
    },
    telemetryCdata: [
      { id: 'user:state:districtConfirmation', type: 'Feature' },
      { id: 'SC-1373', type: 'Task' }
    ]
  },
  districtLocation: {
    state: {
      'code': '27',
      'name': 'Maharashtra',
      'id': '37809706-8f0e-4009-bf67-87bf04f220fa',
      'type': 'state'
    },
    district: 'Pune',
    requestData: {
      'filters': {
        'type': 'district',
        'parentId': '37809706-8f0e-4009-bf67-87bf04f220fa'
      }
    },
    getUserLocationResponse: {
      'id': 'api.location.search',
      'ver': 'v1',
      'ts': '2020-05-07 06:35:51:902+0000',
      'params': {
        'resmsgid': null,
        'msgid': null,
        'err': null,
        'status': 'success',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'response': [
          {
            'code': '2725',
            'name': 'Pune',
            'id': '34b8ac6b-d6c9-4ab1-9fd0-cfb0ec1a2a81',
            'type': 'district',
            'parentId': '37809706-8f0e-4009-bf67-87bf04f220fa'
          },
          {
            'code': '2724',
            'name': 'Raigad',
            'id': '9ab6d64a-1db0-47a6-81df-fa1a360c6802',
            'type': 'district',
            'parentId': '37809706-8f0e-4009-bf67-87bf04f220fa'
          },
          {
            'code': '2732',
            'name': 'Ratnagiri',
            'id': '6287ab42-f6e8-4acf-a798-6173cb0a88d8',
            'type': 'district',
            'parentId': '37809706-8f0e-4009-bf67-87bf04f220fa'
          },
          {
            'code': '2735',
            'name': 'Sangli',
            'id': '7fc4840b-ad66-4b5e-8232-9837beff3128',
            'type': 'district',
            'parentId': '37809706-8f0e-4009-bf67-87bf04f220fa'
          },
        ],
        'count': 36
      }
    },
  },
  getTelemetryData: {
    locationInteractEdata: {
      id: 'submit-clicked',
      type: 'location-changed',
      subtype: 'state-dist-changed'
    },
    telemetryCdata: [
      { id: 'user:state:districtConfirmation', type: 'Feature' },
      { id: 'SC-1373', type: 'Task' }
    ]
  },
  getTelemetryData1: {
    locationInteractEdata: {
      id: 'submit-clicked',
      type: 'location-unchanged',
      subtype: ''
    },
    telemetryCdata: [
      { id: 'user:state:districtConfirmation', type: 'Feature' },
      { id: 'SC-1373', type: 'Task' }
    ]
  }
};
