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
  SYSTEM_ADMINISTRATION: 'SYSTEM_ADMINISTRATION',
  ORG_ADMIN: 'ORG_ADMIN',
  ADMIN: 'ADMIN',
  PUBLIC: 'PUBLIC',
  TEMP_ROLE: 'TEMP_ROLE', // Use only for deprecated APIs
  ALL: 'ALL'  // Use when user does not have PUBLIC role (Case: User bulk upload)
};

const API_LIST = {
  URL: {
    // Content related APIs
    '/content/retire': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.ADMIN,
        ROLE.CONTENT_REVIEWER,
        ROLE.BOOK_REVIEWER,
        ROLE.FLAG_REVIEWER
      ]
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
        ROLE.COURSE_CREATOR
      ]
    },
    '/content/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.BOOK_CREATOR,
        ROLE.COURSE_CREATOR
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
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER,
        ROLE.COURSE_MENTOR, ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR, ROLE.BOOK_REVIEWER,
        ROLE.FLAG_REVIEWER
      ]
    },
    '/content/flag/reject': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER,
        ROLE.COURSE_MENTOR, ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR, ROLE.BOOK_REVIEWER,
        ROLE.FLAG_REVIEWER
      ]
    },

    '/content/v1/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
 
    '/content/v1/upload': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.TEMP_ROLE]
    },

    '/content/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    '/content/asset/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.BOOK_CREATOR, ROLE.COURSE_CREATOR]
    },

    '/content/asset/v1/upload/:id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.BOOK_CREATOR, ROLE.COURSE_CREATOR]
    },

    '/content/content/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.BOOK_CREATOR,
        ROLE.COURSE_CREATOR
      ]
    },
    '/content/content/v1/read/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/content/content/v1/retire': {
      description: 'API to delete the content(s)',
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.ADMIN,
        ROLE.BOOK_REVIEWER,
        ROLE.CONTENT_REVIEWER,
        ROLE.CONTENT_CREATOR,
        ROLE.BOOK_CREATOR,
        ROLE.COURSE_CREATOR
      ]
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
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.COURSE_CREATOR, ROLE.BOOK_CREATOR]
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
      ROLE_CHECK: [ROLE.CONTENT_CREATOR,  ROLE.COURSE_CREATOR, ROLE.BOOK_CREATOR]
    },
    '/content/v3/review': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_REVIEWER,
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
      ROLE_CHECK: [
        ROLE.ADMIN,
        ROLE.CONTENT_CREATOR,
        ROLE.CONTENT_REVIEWER,
        ROLE.BOOK_CREATOR
      ]
    },
    '/content/course/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.BOOK_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.CONTENT_CREATOR
      ]
    },

    // Collection Editor
    '/action/content/v1/collaborator/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.BOOK_CREATOR]
    },
    '/action/content/v3/hierarchy/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER, ROLE.BOOK_CREATOR]
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
        ROLE.CONTENT_REVIEWER,
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
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR, ROLE.BOOK_REVIEWER,
        ROLE.FLAG_REVIEWER, ROLE.ORG_ADMIN
      ]
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
      ROLE_CHECK: [ROLE.CONTENT_CREATOR, ROLE.COURSE_CREATOR, ROLE.BOOK_CREATOR]
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
      ROLE_CHECK: [ROLE.TEMP_ROLE]
    },
    '/learner/data/v1/system/settings/get/groupsTnc': {
      description: 'To fetch updated value for groups TnC',
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
      ROLE_CHECK: [ROLE.TEMP_ROLE]
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
      ROLE_CHECK: [ROLE.COURSE_MENTOR]
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
      ROLE_CHECK: [ROLE.ADMIN]
    },
    '/learner/user/v3/read/:userId': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC, ROLE.ADMIN]
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
      ROLE_CHECK: [ROLE.PUBLIC, ROLE.ADMIN]
    },
    '/learner/user/v1/consent/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v2/accept/tnc': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/learner/user/v2/bulk/upload': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.ADMIN]
    },
    '/learner/user/v2/upload': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.ADMIN]
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
    '/learner/info': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.TEMP_ROLE]
    },
    '/learner/data/v1/location/search': {
      checksNeeded: []
    },
    '/v1/location/search': {
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
      ROLE_CHECK: [ROLE.ADMIN]
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
      ROLE_CHECK: [ROLE.TEMP_ROLE]
    },
    '/learner/dashboard/v1/consumption/org': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.TEMP_ROLE]
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
      ROLE_CHECK: [ROLE.TEMP_ROLE]
    },
    '/learner/notes/v1/delete': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.TEMP_ROLE]
    },
    '/learner/notes/v1/read': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.TEMP_ROLE]
    },
    '/learner/notes/v1/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.TEMP_ROLE]
    },
    '/learner/notes/v1/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.TEMP_ROLE]
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

    //certreg reg apis
    '/certreg/v1/user/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.COURSE_MENTOR, ROLE.CONTENT_CREATOR]
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
    '/course/batch/cert/v1/template/remove' : {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.COURSE_MENTOR, ROLE.CONTENT_CREATOR]
    },

    // get user session
    '/learner/get/user/sessionId/:userId': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },

    // Assessment service
    '/action/assessment/v3/items/read/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER, ROLE.COURSE_MENTOR, ROLE.COURSE_CREATOR, ROLE.BOOK_CREATOR, ROLE.BOOK_REVIEWER, ROLE.FLAG_REVIEWER
      ]
    },
    '/action/assessment/v3/items/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER, ROLE.COURSE_MENTOR, ROLE.COURSE_CREATOR, ROLE.BOOK_CREATOR, ROLE.BOOK_REVIEWER, ROLE.FLAG_REVIEWER
      ]
    },
    '/action/assessment/v3/items/update/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR, ROLE.COURSE_CREATOR, ROLE.BOOK_CREATOR
      ]
    },
    '/action/assessment/v3/items/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR, ROLE.COURSE_CREATOR, ROLE.BOOK_CREATOR
      ]
    },
    '/action/assessment/v3/itemsets/retire/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR, ROLE.COURSE_CREATOR, ROLE.BOOK_CREATOR
      ]
    },

    // Assessment items service
    '/action/assessmentitems/update/': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/assessmentitems/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },

    // Content service
    '/action/content/v3/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/content/v3/update/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/content/v3/read/:do_id': {
      description: 'API is accessed by non logged in user',
      checksNeeded: []
    },
    '/action/content/v3/bundle': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/content/v3/hierarchy/:do_id': {
      description: 'API used to read textbook for anonymous users',
      checksNeeded: [],
    },
    '/action/content/v3/hierarchy/update': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/content/v3/review/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/content/v3/publish/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_REVIEWER,
        ROLE.BOOK_REVIEWER
      ]
    },
    '/action/content/v3/upload/url/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/content/v3/reject/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_REVIEWER,
        ROLE.BOOK_REVIEWER
      ]
    },
    '/action/content/v3/retire/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR,
        ROLE.ORG_ADMIN
      ]
    },
    '/action/content/v3/flag/accept/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_REVIEWER,
        ROLE.BOOK_REVIEWER
      ]
    },
    '/action/content/v3/flag/reject/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_REVIEWER,
        ROLE.BOOK_REVIEWER
      ]
    },
    '/action/content/v3/upload/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/content/v3/unlisted/publish/:contentId': {
      description: 'API is used to share content for Limited Sharing feature',
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR,
        ROLE.CONTENT_REVIEWER,
        ROLE.BOOK_REVIEWER
      ]
    },
    '/plugin/review/comment/v1/read/comment': {
      description: 'API which provides stage level comments provided by reviewers',
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR,
        ROLE.CONTENT_REVIEWER,
        ROLE.BOOK_REVIEWER
      ]
    },
    '/plugin/review/comment/v1/create/comment': {
      description: 'Comments added to slide by reviewer',
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR,
        ROLE.CONTENT_REVIEWER,
        ROLE.BOOK_REVIEWER
      ]
    },

    // Dial code service
    '/action/dialcode/v3/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/dialcode/v3/read/:dialId': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/dialcode/v1/reserve/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/dialcode/v1/process/status/:processId': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/collection/v3/dialcode/link/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },

    // Language service
    '/action/language/v3/list': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/language/v3/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/language/definition/v3/read/Word': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/language/v3/tools/parser': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/language/v3/tools/transliterate': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/language/v3/tools/translate': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/language/v3/varnas/syllables/list': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/language/v3/varnas/vowels/list': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/language/v3/varnas/consonants/list': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },

    // Lock service
    '/action/lock/v1/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/lock/v1/refresh': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/lock/v1/retire': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },

    // Learning service
    '/action/learning/taxonomy/domain/definition/:objType': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },

    // Meta service
    '/action/meta/v3/resourcebundles/read/:lineCode': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/meta/v3/terms/list': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/meta/v3/ordinals/list': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },

    // Domain service
    '/action/domain/v3/terms/list': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },

    // Framework service
    '/action/framework/v3/read/:frameworkId': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR,
        ROLE.CONTENT_REVIEWER,
        ROLE.BOOK_REVIEWER
      ]
    },

    // Channel service
    '/action/channel/v3/read/:channel': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },

    // Vocabulary service
    '/action/vocabulary/v3/term/suggest': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/vocabulary/v3/term/create': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },

    // Data service
    '/action/data/v1/page/assemble': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/data/v1/form/read': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR, ROLE.CONTENT_REVIEWER, ROLE.COURSE_MENTOR, ROLE.COURSE_CREATOR, ROLE.BOOK_CREATOR, ROLE.BOOK_REVIEWER, ROLE.FLAG_REVIEWER
      ]
    },
    '/action/asset/v3/validate': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },

    // Composite service
    '/action/composite/v3/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },

    // Textbook service
    '/action/textbook/v1/toc/upload/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/textbook/v1/toc/download/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.BOOK_CREATOR
      ]
    },

    // User service
    '/action/user/v1/search': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/content/v1/collaborator/update/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.CONTENT_CREATOR,
        ROLE.COURSE_CREATOR,
        ROLE.BOOK_CREATOR
      ]
    },
    '/action/system/v3/content/update/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.ORG_ADMIN
      ]
    },
    '/action/content/v3/copy/:do_id': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [
        ROLE.ORG_ADMIN,
        ROLE.BOOK_CREATOR
      ]
    },
    '/signup': {
      checksNeeded: []
    },
    '/collection-editor/telemetry': {
      checksNeeded: []
    },
    '/content-editor/telemetry': {
      checksNeeded: []
    },
    '/app/telemetry': {
      checksNeeded: []
    },
    '/v1/tenant/info/:tenantId': {
      checksNeeded: []
    },
    '/v1/user/session/start/:deviceId': {
      checksNeeded: []
    },
    '/content/data/v1/telemetry': {
      checksNeeded: []
    },
    '/getGeneralisedResourcesBundles/:lang/:fileName': {
      checksNeeded: []
    },
    '/v1/desktop/handleGauth': {
      checksNeeded: []
    },
    '/v1/desktop/google/auth/success': {
      checksNeeded: []
    },
    '/service/health': {
      checksNeeded: []
    },
    '/health': {
      checksNeeded: []
    },
    '/plugin/v1/form/read': {
      checksNeeded: []
    },
    '/v1/tenant/info/': {
      checksNeeded: []
    },
    '/device/register/:deviceId': {
      checksNeeded: []
    },
    '/user/v1/switch/:userId': {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: [ROLE.PUBLIC]
    },
    '/api/data/v1/form/update': {
      description: 'API for form update; mobile team also uses same API.',
      checksNeeded: []
    },
    '/plugin/v1/form/update': {
      description: 'API for form update; mobile team also uses same API.',
      checksNeeded: []
    },
    '/google/auth': {
      checksNeeded: []
    },
    // discussion forum apis
    '/discussion/user/v1/create': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/forum/v2/read': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/forum/v2/create': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/forum/v2/remove': {
      description: 'API to remove category id attached to a batch/course ',
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/tags': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/notifications': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/category/:category_id': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/categories': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/categories/:cid/moderators': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/user/:userslug': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/user/:userslug/upvoted': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/user/:userslug/downvoted': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/user/:userslug/bookmarks': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/user/:userslug/best': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/unread': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/recent': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/popular': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/top': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/topic/:topic_id/:slug': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/unread/total': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/topic/teaser/:topic_id': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/topic/pagination/:topic_id': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/groups': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/groups/:slug': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/groups/:slug/members': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/user/:userslug/downvoted': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/recent/posts/:day': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/topics': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/topics/:tid': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/topics/:tid/state': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/topics/:tid/follow': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/topics/:tid/tags': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/topics/:tid/pin': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/categories': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/categories/:cid': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/categories/:cid/state': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/categories/:cid/privileges': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/groups': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/groups/:slug': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/groups/:slug/membership': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/groups/:slug/membership/:uid': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/posts/:pid': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/posts/:pid/state': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/posts/:pid/vote': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/posts/:pid/bookmark': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/users': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/users/:uid': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/users/:uid/password': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/users/:uid/follow': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/users/:uid/chats': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/users/:uid/ban': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/users/:uid/tokens': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/v2/users/:uid/tokens/:token': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/user/username/:username': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/discussion/user/uid/:uid': {
      checksNeeded: [],
      ROLE_CHECK: [ROLE.ALL, ROLE.PUBLIC]
    },
    '/v1/sso/create/session': {
      description: 'Desktop API',
      checksNeeded:[]
    },
    '/api/data/v1/form/read': {
      description: 'Desktop API',
      checksNeeded:[]
    }
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
    '/content/asset/v1/upload/:id',
    '/learner/get/user/sessionId/:userId',
    '/action/assessment/v3/items/read/:do_id',
    '/action/assessment/v3/items/update/:do_id',
    '/action/assessment/v3/itemsets/retire/:do_id',
    '/action/content/v3/update/:do_id',
    '/action/content/v3/read/:do_id',
    '/action/content/v3/hierarchy/:do_id',
    '/action/content/v3/review/:do_id',
    '/action/content/v3/publish/:do_id',
    '/action/content/v3/upload/url/:do_id',
    '/action/content/v3/reject/:do_id',
    '/action/content/v3/retire/:do_id',
    '/action/content/v3/flag/accept/:do_id',
    '/action/content/v3/flag/reject/:do_id',
    '/action/content/v3/upload/:do_id',
    '/action/content/v3/unlisted/publish/:contentId',
    '/action/dialcode/v3/read/:dialId',
    '/action/dialcode/v1/reserve/:do_id',
    '/action/dialcode/v1/process/status/:processId',
    '/action/collection/v3/dialcode/link/:do_id',
    '/action/learning/taxonomy/domain/definition/:objType',
    '/action/meta/v3/resourcebundles/read/:lineCode',
    '/action/framework/v3/read/:frameworkId',
    '/action/channel/v3/read/:channel',
    '/action/textbook/v1/toc/upload/:do_id',
    '/action/textbook/v1/toc/download/:do_id',
    '/action/content/v1/collaborator/update/:do_id',
    '/action/system/v3/content/update/:do_id',
    '/action/content/v3/copy/:do_id',
    '/v1/tenant/info/:tenantId',
    '/v1/user/session/start/:deviceId',
    '/getGeneralisedResourcesBundles/:lang/:fileName',
    '/discussion/category/:category_id',
    '/discussion/categories/:cid/moderators',
    '/discussion/user/:userslug',
    '/discussion/user/:userslug/upvoted',
    '/discussion/user/:userslug/downvoted',
    '/discussion/user/:userslug/bookmarks',
    '/discussion/user/:userslug/best',
    '/discussion/topic/:topic_id/:slug',
    '/discussion/topic/teaser/:topic_id',
    '/discussion/topic/pagination/:topic_id',
    '/discussion/groups/:slug',
    '/discussion/groups/:slug/members',
    '/discussion/user/:userslug/downvoted',
    '/discussion/recent/posts/:day',
    '/discussion/v2/topics/:tid',
    '/discussion/v2/topics/:tid/state',
    '/discussion/v2/topics/:tid/follow',
    '/discussion/v2/topics/:tid/tags',
    '/discussion/v2/topics/:tid/pin',
    '/discussion/v2/categories/:cid',
    '/discussion/v2/categories/:cid/state',
    '/discussion/v2/categories/:cid/privileges',
    '/discussion/v2/groups/:slug',
    '/discussion/v2/groups/:slug/membership',
    '/discussion/v2/groups/:slug/membership/:uid',
    '/discussion/v2/posts/:pid',
    '/discussion/v2/posts/:pid/state',
    '/discussion/v2/posts/:pid/vote',
    '/discussion/v2/posts/:pid/bookmark',
    '/discussion/v2/users/:uid',
    '/discussion/v2/users/:uid/password',
    '/discussion/v2/users/:uid/follow',
    '/discussion/v2/users/:uid/chats',
    '/discussion/v2/users/:uid/ban',
    '/discussion/v2/users/:uid/tokens',
    '/discussion/v2/users/:uid/tokens/:token',
    '/discussion/user/username/:username',
    '/discussion/user/uid/:uid',
    '/device/register/:deviceId',
    '/user/v1/switch/:userId'
  ]
};
module.exports = API_LIST;
