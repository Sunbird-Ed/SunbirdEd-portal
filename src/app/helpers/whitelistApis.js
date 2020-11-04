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
  CONTENT_REVIEWER: 'CONTENT_REVIEWER',
  COURSE_MENTOR: 'COURSE_MENTOR',
  COURSE_CREATOR: 'COURSE_CREATOR',
  BOOK_CREATOR: 'BOOK_CREATOR',
  BOOK_REVIEWER: 'BOOK_REVIEWER',
  FLAG_REVIEWER: 'FLAG_REVIEWER',
  PUBLIC: 'PUBLIC',
  ALL: 'ALL'  // Use when user does not have PUBLIC role (Case: User bulk upload)
};

const API_LIST = {
  URL: {
    // Content related APIs
    '/content/retire': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.BOOK_CREATOR]
    },
    '/content/reject': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_REVIEWER, ROLE.BOOK_REVIEWER, ROLE.FLAG_REVIEWER]
    },
    '/content/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.BOOK_CREATOR,
        ROLE.CONTENT_REVIEWER,
        ROLE.BOOK_REVIEWER
      ]
    },
    '/content/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.BOOK_CREATOR,
        ROLE.CONTENT_REVIEWER,
        ROLE.BOOK_REVIEWER
      ]
    },
    '/content/review': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_REVIEWER, ROLE.BOOK_REVIEWER, ROLE.FLAG_REVIEWER]
    },
    '/content/content/v1/publish': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_REVIEWER, ROLE.BOOK_REVIEWER, ROLE.FLAG_REVIEWER]
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
 
    '/content/v1/upload': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    '/content/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    '/content/asset/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    '/content/asset/v1/upload/:id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    '/content/content/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.BOOK_CREATOR,
        ROLE.CONTENT_REVIEWER,
        ROLE.BOOK_REVIEWER
      ]
    },
    '/content/content/v1/read/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/content/v1/retire': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.BOOK_CREATOR]
    },
    '/content/content/v1/reject': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_REVIEWER, ROLE.BOOK_REVIEWER, ROLE.FLAG_REVIEWER]
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
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER, ROLE.BOOK_CREATOR]
    },
    '/content/content/v1/publish/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_REVIEWER, ROLE.BOOK_REVIEWER]
    },
    '/content/content/v1/reject/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_REVIEWER, ROLE.BOOK_REVIEWER]
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
      ROLE_CHECK: [ROLE.CONTENT_CREATOR,  ROLE.CONTENT_REVIEWER, ROLE.BOOK_CREATOR]
    },
    '/content/v3/review': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_REVIEWER,
        ROLE.CONTENT_CREATOR,
        ROLE.BOOK_CREATOR,
        ROLE.BOOK_REVIEWER,
        ROLE.FLAG_REVIEWER
      ]
    },
    '/content/v3/hierarchy/add': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER, ROLE.BOOK_CREATOR]
    },
    '/content/v3/hierarchy/remove': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER, ROLE.BOOK_CREATOR]
    },
    '/content/course/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    // Collection Editor
    '/action/content/v1/collaborator/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER, ROLE.BOOK_CREATOR]
    },
    '/action/content/v3/hierarchy/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER, ROLE.BOOK_CREATOR]
    },
    '/action/content/v3/read': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/lock/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER, ROLE.BOOK_CREATOR]
    },
    '/content/lock/v1/retire': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER, ROLE.BOOK_CREATOR]
    },
    '/content/lock/v1/list': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER, ROLE.BOOK_CREATOR]
    },
    '/action/content/v3/review': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.CONTENT_REVIEWER,
        ROLE.BOOK_CREATOR,
        ROLE.BOOK_REVIEWER,
        ROLE.FLAG_REVIEWER
      ]
    },
    '/action/content/v3/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER, ROLE.BOOK_CREATOR]
    },

    // Content Editor
    '/content/composite/v1/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.ALL]
    },

    // Generic Editor
    '/action/content/v3/bundle': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.CONTENT_REVIEWER,
        ROLE.BOOK_CREATOR,
        ROLE.BOOK_REVIEWER,
        ROLE.FLAG_REVIEWER
      ]
    },
    '/action/content/v3/upload': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER, ROLE.BOOK_CREATOR]
    },
    //System related APIs
    '/learner/data/v1/system/settings/get/contentComingSoonMsg': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/data/v1/system/settings/get/custodianOrgId': {
      checksNeeded: []
    },
    '/learner/data/v1/system/settings/get/courseFrameworkId': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/data/v1/system/settings/get/tncConfig': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/data/v1/system/settings/get/ssoCourseSection': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/data/v1/system/settings/get/:slug': {
      checksNeeded: []
    },
    '/learner/data/v1/system/settings/get/googleReCaptcha': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/data/v1/system/settings/list': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    //Course related APIs
    '/learner/course/v1/hierarchy/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/course/v1/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/course/v1/content/state/read': {
      checksNeeded: ['ROLE_CHECK', 'OWNER_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC],
      OWNER_CHECK: {
        checks: [
          { entity: '__session__userId', params: [] }
        ]
      }
    },
    '/content/course/v1/content/state/update': {
      checksNeeded: ['ROLE_CHECK', 'OWNER_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC],
      OWNER_CHECK: {
        checks: [
          { entity: '__session__userId', params: [] }
        ]
      }
    },
    '/learner/course/v1/user/enrollment/list/:userId': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.ALL]
    },
    '/learner/course/v1/enrol': {
      checksNeeded: ['ROLE_CHECK', 'OWNER_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC],
      OWNER_CHECK: {
        checks: [
          { entity: '__session__userId', params: [] }
        ]
      }
    },
    '/learner/course/v1/unenrol': {
      checksNeeded: ['ROLE_CHECK', 'OWNER_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC],
      OWNER_CHECK: {
        checks: [
          { entity: '__session__userId', params: [] }
        ]
      }
    },
    '/learner/course/v1/qrcode/download': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.COURSE_CREATOR, ROLE.CONTENT_CREATOR]
    },
    '/learner/recommended/courses': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/badging/v1/issuer/badge/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/badging/v1/issuer/badge/assertion/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/org/v2/preferences/read': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    //Batch related APIs
    '/learner/course/v1/batch/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.COURSE_MENTOR, ROLE.CONTENT_CREATOR]
    },
    '/learner/course/v1/batch/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.COURSE_MENTOR, ROLE.CONTENT_CREATOR]
    },
    '/learner/course/v1/batch/user/add': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.COURSE_MENTOR, ROLE.CONTENT_CREATOR]
    },
    '/learner/course/v1/batch/read/:batchId': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/course/v1/batch/participants/list': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/course/v1/batch/list': {
      checksNeeded: []
    },
    '/learner/course/v1/batch/user/remove': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.COURSE_MENTOR, ROLE.CONTENT_CREATOR]
    },

    //User related APIs
    '/learner/user/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v1/managed': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v1/tnc/accept': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.ALL]
    },
    '/learner/user/v1/update': {
      checksNeeded: ['ROLE_CHECK', 'OWNER_CHECK'],
      ROLE_CHECK: [ROLE.ALL],
      OWNER_CHECK: {
        checks: [
          { entity: '__session__userId', params: [] }
        ]
      }
    },
    '/learner/user/v1/get': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v1/exists': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v1/signup': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v1/feed/:userId': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v1/migrate': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v1/type/list': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v1/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v1/upload': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v3/read/:userId': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.ALL]
      // OWNER_CHECK: {
      //   checks: [
      //     { entity: '__adminCheck__userId', params: [] }
      //   ]
      // }
    },
    '/learner/user/v1/declarations': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.ALL]
    },
    '/learner/user/v1/consent/read': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.ALL]
    },
    '/learner/user/v1/consent/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.ALL]
    },
    '/learner/user/v2/accept/tnc': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v2/bulk/upload': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v2/upload': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v4/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/get/tenant/logo': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner//v1/tenant': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner//info': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/data/v1/location/search': {
      checksNeeded: []
    },
    '/learner/data/v1/role/read': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/certreg/v1/certs/validate': {
      checksNeeded: []
    },
    '/learner/otp/v1/verify': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/otp/v1/generate': {
      checksNeeded: []
    },
    '/learner/certreg/v1/certs/download': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/certreg/v2/certs/download/:id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    //Admin related APIs
    '/learner/data/v1/upload/status': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    // ORD related APIs
    '/learner/org/v1/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/org/v1/type/list': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    //Dashboard related APIs
    '/learner/dashboard/v1/creation/org': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/dashboard/v1/consumption/org': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/dashboard/v1/progress/course': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.COURSE_MENTOR]
    },
    '/learner/dashboard/v1/consumption/course': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.COURSE_MENTOR]
    },
    '/learner/dashboard/v2/progress/course/:batchId': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.COURSE_MENTOR]
    },

    // Notes related APIs
    '/learner/notes/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/notes/v1/delete': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/notes/v1/read': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/notes/v1/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/notes/v1/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    //Other APIs
    '/learner/framework/v1/read': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/data/v1/page/assemble': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/role/read': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v1/exists/email/:emailId': {
      checksNeeded: []
    },
    '/learner/user/v1/exists/phone/:phoneNumber': {
      checksNeeded: []
    },
    '/learner/anonymous/otp/v1/generate': {
      checksNeeded: []
    },
    '/learner/data/v1/form/read': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    // Groups related APIs
    '/learner/group/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/group/v1/list': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/group/v1/read/:groupId': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/group/v1/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/group/v1/delete': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v2/exists/:key/:value': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/data/v1/group/activity/agg': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/group/membership/v1/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    '/certreg/composite/v1/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    //certreg reg apis
    '/certreg/v1/user/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.COURSE_MENTOR]
    },
    '/certreg/v1/cert/reissue': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.COURSE_MENTOR]
    },
    '/certreg/v1/add/template': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.COURSE_MENTOR, ROLE.CONTENT_CREATOR]
    },
    '/certreg/v1/template/add': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.COURSE_MENTOR, ROLE.CONTENT_CREATOR]
    },
  },
  URL_PATTERN: [
    '/content/content/v1/read/:do_id',
    '/content/content/v1/copy/:do_id',
    '/content/content/v1/publish/:do_id',
    '/content/content/v1/reject/:do_id',
    '/content/content/v1/flag/accept/:do_id',
    '/content/content/v1/flag/reject/:do_id',
    '/learner/data/v1/system/settings/get/:slug',
    '/learner/course/v1/hierarchy/:do_id',
    '/learner/user/v3/read/:userId',
    '/learner/course/v1/user/enrollment/list/:userId',
    '/learner/user/v1/feed/:userId',
    '/learner/course/v1/batch/read/:batchId',
    '/learner/dashboard/v2/progress/course/:batchId',
    '/learner/user/v1/exists/email/:emailId',
    '/learner/user/v1/exists/phone/:phoneNumber',
    '/learner/group/v1/read/:groupId',
    '/learner/user/v2/exists/:key/:value',
    '/learner/certreg/v2/certs/download/:id',
    '/content/asset/v1/upload/:id'
  ]
};
module.exports = API_LIST;
