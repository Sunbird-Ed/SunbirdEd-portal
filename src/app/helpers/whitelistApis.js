'use strict';
/**
 * @file - Portal Backend API(s) list
 * @description - Whitelisted URL(s)
 * @since release-3.1.0
 * @version 1.0
 */

const CHECK = {
  ROLE: 'ROLE_CHECK',
};
const ROLE = {
  CONTENT_CREATOR: 'CONTENT_CREATOR',
  CONTENT_REVIEW: 'CONTENT_REVIEW',
  CONTENT_CREATION: 'CONTENT_CREATION',
  CONTENT_REVIEWER: 'CONTENT_REVIEWER',
  FLAG_REVIEWER: 'FLAG_REVIEWER',
  PUBLIC: 'PUBLIC'
};

const API_LIST = {
  URL: {
    // Content related APIs
    '/content/retire': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/reject': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/review': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/content/v1/publish': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/flag/accept': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/flag/reject': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    '/content/v1/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/content/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/v1/media/upload': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/v1/read': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/content/v1/retire': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/content/v1/reject': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/v1/flag': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/content/v1/flag/accept': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/content/v1/flag/reject': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    '/content/content/v1/copy/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.CONTENT_CREATION, ROLE.CONTENT_REVIEWER]
    },
    '/content/content/v1/publish/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_REVIEWER, ROLE.CONTENT_REVIEW]
    },
    '/content/content/v1/reject/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_REVIEWER, ROLE.CONTENT_REVIEW]
    },
    '/content/content/v1/flag/accept/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.FLAG_REVIEWER]
    },
    '/content/content/v1/flag/reject/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.FLAG_REVIEWER]
    },

    '/content/v3/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/v3/review': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/v3/hierarchy/add': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/v3/hierarchy/remove': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/course/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    // Collection Editor
    '/action/content/v1/collaborator/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/action/content/v3/hierarchy/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/action/content/v3/read': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/lock/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/lock/v1/retire': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/lock/v1/list': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/action/content/v3/review': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/action/content/v3/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    // Content Editor
    '/content/composite/v1/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    // Generic Editor
    '/action/content/v3/bundle': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/action/content/v3/upload': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    }
  },
  URL_PATTERN: [
    '/content/content/v1/copy/:do_id'
  ]
};
module.exports = API_LIST;
