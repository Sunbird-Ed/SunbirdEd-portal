export const userLocationMockData = {
  eventObject: {
    target: {
      value: {}
    }
  },
  result:{
    response:[{
      code: '2',
      name: 'Himachal Pradesh',
      id: '3789e5e3-a31f-43fa-9cb3-c1b26460fff3',
      type: 'state'
    },{
      code: '3',
      name: 'karnataka',
      id: '3789e5e3-a31f-43fa-9cb3-c1b26460fff4',
      type: 'state'
    }]

  },
  state:'KARNATAKA',
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
  },
  {code: '3045',
  name: 'Bangalore',
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
  deviceLocation:{
    "id": "analytics.device-profile",
    "ver": "1.0",
    "ts": "2023-09-30T05:28:55.502+00:00",
    "params": {
        "resmsgid": "2a4d1a08-3a7a-4ccb-a6ed-693fadea0810",
        "status": "successful",
        "client_key": null
    },
    "responseCode": "OK",
    "result": {
        "ipLocation": {
            "state": "Karanataka",
            "district": "Bangalore"
        }
    }
}
};
