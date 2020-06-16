'use strict';
/**
 * @file - Portal Backend API(s) list
 * @description - Whitelisted URL(s)
 * @since release-3.1.0
 * @version 1.0
 */

module.exports = {
  // Content related APIs
  '/content/retire': '/content/retire',
  '/content/reject': '/content/reject',
  '/content/create': '/content/create',
  '/content/update': '/content/update',
  '/content/review': '/content/review',
  '/content/v1/publish': '/content/v1/publish',
  '/content/flag/accept': '/content/flag/accept',
  '/content/flag/reject': '/content/flag/reject',

  '/content/v1/search': '/content/v1/search',
  '/content/v1/create': '/content/v1/create',
  '/content/v1/media/upload': '/content/v1/media/upload',
  '/content/v1/read': '/content/v1/read',
  '/content/v1/retire': '/content/v1/retire',
  '/content/v1/reject': '/content/v1/reject',
  '/content/v1/flag': '/content/v1/flag',
  '/content/v1/flag/accept': '/content/v1/flag/accept',
  '/content/v1/flag/reject': '/content/v1/flag/reject',
  '/content/v1/copy': '/content/v1/copy',

  '/content/v3/update': '/content/v3/update',
  '/content/v3/review': '/content/v3/review',
  '/content/v3/hierarchy/add': '/content/v3/hierarchy/add',
  '/content/v3/hierarchy/remove': '/content/v3/hierarchy/remove',
  '/course/v1/create': '/course/v1/create',

  // Collection Editor
  '/action/content/v1/collaborator/update': '/action/content/v1/collaborator/update',
  '/action/content/v3/hierarchy/update': '/action/content/v3/hierarchy/update',
  '/action/content/v3/read': '/action/content/v3/read',
  '/content/lock/v1/create': '/content/lock/v1/create',
  '/content/lock/v1/retire': '/content/lock/v1/retire',
  '/content/lock/v1/list': '/content/lock/v1/list',
  '/action/content/v3/review': '/action/content/v3/review',
  '/action/content/v3/update': '/action/content/v3/update',

  // Content Editor
  '/content/composite/v1/search': '/content/composite/v1/search',

  // Generic Editor
  '/action/content/v3/bundle': '/action/content/v3/bundle',
  '/action/content/v3/upload': '/action/content/v3/upload'
};
