export const userLocationMockData = {
  stateList: [{
    code: '2',
    name: 'Himachal Pradesh',
    id: '4a6d77a1-6653-4e30-9be8-93371b6b53b5',
    type: 'state'
  }],
  districtList: [{
    code: '2907',
    name: 'KOPPAL',
    id: 'cde02789-5803-424b-a3f5-10db347280e9',
    type: 'district',
    parentId: '4a6d77a1-6653-4e30-9be8-93371b6b53b5'
  }],
  stateResponse: {
    result: {
      response: [{
        code: '2',
        name: 'Himachal Pradesh',
        id: '2',
        type: 'state'
      }]
    }
  },
  districtResponse: {
    result: {
      response: [{
        code: '2907',
        name: 'KOPPAL',
        id: 'cde02789-5803-424b-a3f5-10db347280e9',
        type: 'district',
        parentId: '4a6d77a1-6653-4e30-9be8-93371b6b53b5'
      }]
    }
  },
  serverError: {
    error: {
      params: {
        status: 'INTERNAL_SERVER_ERROR'
      }
    }
  },
  resourceBundle: {
    frmelmnts: {
      instn: {},
      lbl: {},
    },
    messages: {
      fmsg: {},
      emsg: {
        m0016: 'm0016',
        m0017: 'm0017',
      }
    },
  },
  eventObject: {
    target: {
      value: {}
    }
  },
  mockLocation: {
    state: 'Himachal Pradesh',
    district: 'KOPPAL'
  },
};
