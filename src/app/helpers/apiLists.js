'use strict';
/**
 * @file - Portal Backend API(s) list
 * @description - URL listed will have boolean value to ensure
 * whether it is whitelisted (or) not
 * `DEFAULT` will be the fallback
 * @since release-3.1.0
 * @version 1.0
 */

module.exports = {
  CONTENT: {
    // Content related APIs
    '/content/retire': true,
    '/content/reject': true,
    '/content/create': true,
    '/content/update': true,
    '/content/review': true,
    '/content/v1/publish': true,
    '/content/flag/accept': true,
    '/content/flag/reject': true,

    '/content/v1/search': true,
    '/content/v1/create': true,
    '/content/v1/media/upload': true,
    '/content/v1/read': true,
    '/content/v1/retire': true,
    '/content/v1/reject': true,
    '/content/v1/flag': true,
    '/content/v1/flag/accept': true,
    '/content/v1/flag/reject': true,
    '/content/v1/copy': true,

    '/content/v3/update': true,
    '/content/v3/review': true,
    '/content/v3/hierarchy/add': true,
    '/content/v3/hierarchy/remove': true,
    '/course/v1/create': true,

    // Collection Editor
    '/action/content/v1/collaborator/update': true,
    '/action/content/v3/hierarchy/update': true,
    '/action/content/v3/read': true,
    '/content/lock/v1/create': true,
    '/content/lock/v1/retire': true,
    '/content/lock/v1/list': true,
    '/action/content/v3/review': true,
    '/action/content/v3/update': true,

    // Content Editor
    '/content/composite/v1/search': true,

    // Generic Editor
    '/action/content/v3/bundle': true,
    '/action/content/v3/upload': true
  },
  DEFAULT: {

  }
};
