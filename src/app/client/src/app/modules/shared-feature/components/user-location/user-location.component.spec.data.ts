export const userLocationMockData = {
  eventObject: {
    target: {
      value: {}
    }
  },
  stateList: [{
    code: '2',
    name: 'Himachal Pradesh',
    id: '3789e5e3-a31f-43fa-9cb3-c1b26460fff3',
    type: 'state'
  }],
  districtList: [{
    code: '2907',
    name: 'KOPPAL',
    id: 'cde02789-5803-424b-a3f5-10db347280e9',
    type: 'district',
    parentId: '4a6d77a1-6653-4e30-9be8-93371b6b53b5'
  }],
  telemetryData: {
    locationIntractEdata: {
      id: 'submit-clicked',
      type: 'location-unchanged',
      subtype: ''
    },
    telemetryCdata: [
      {id: 'user:state:districtConfimation', type: 'Feature'},
      {id: 'SC-1373', type: 'Task'}
    ]
  },
  stateChanged: {
    locationIntractEdata: {
      id: 'submit-clicked',
      type: 'location-changed',
      subtype: 'state-changed'
    },
    telemetryCdata: [
      {id: 'user:state:districtConfimation', type: 'Feature'},
      {id: 'SC-1373', type: 'Task'}
    ]
  },
  districtChanged: {
    locationIntractEdata: {
      id: 'submit-clicked',
      type: 'location-changed',
      subtype: 'dist-changed'
    },
    telemetryCdata: [
      {id: 'user:state:districtConfimation', type: 'Feature'},
      {id: 'SC-1373', type: 'Task'}
    ]
  },
  bothChanged: {
    locationIntractEdata: {
      id: 'submit-clicked',
      type: 'location-changed',
      subtype: 'state-dist-changed'
    },
    telemetryCdata: [
      {id: 'user:state:districtConfimation', type: 'Feature'},
      {id: 'SC-1373', type: 'Task'}
    ]
  },
};
