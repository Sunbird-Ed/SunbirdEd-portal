import { of } from 'rxjs';

export const impressionObj = {
  context: {
    env: 'groups'
  },
  edata: {
    type: 'view',
    subtype: 'paginate',
    pageid: 'my-groups',
    uri: '/my-groups',
    duration : 2,
  },
  object: {
    id: '123',
    type: 'group',
    ver: '1.0',
}
};

export const interactObj = {
  context: {
    env: 'groups',
    cdata: [],
  },
  edata: {
    id: '123',
    type: 'view',
    pageid: 'my-groups',
  },
  object: {
    id: '123',
    type: 'group',
    ver: '1.0',
}
};

export const fakeActivatedRoute = {
  'params': of ({}),
  snapshot: {
      data: {
          telemetry: {
              env: 'groups', pageid: 'my-groups', type: 'view', subtype: 'paginate'
          }
      }
  }
};

export const fakeActivatedRouteWithGroupId = {
  'params': of ({groupId: '123'}),
  snapshot: {
      data: {
          telemetry: {
              env: 'groups', pageid: 'my-groups', type: 'view', subtype: 'paginate'
          }
      }
  }
};
