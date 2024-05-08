'use strict';
/**
 * @file - Portal Backend API(s) feature list
 * @description - Feature mappings of URL(s)
 * @since release-8.0.0
 * @version 1.0
 */

const FEATURE_LIST = {
  URL: {
    '/action/content/v3/unlisted/publish/:contentId':'ContentPublish',
    '/action/questionset/v2/publish/:do_id':'QuestionsetPublish',
    '/action/question/v2/publish/:do_id':'QuestionPublish'
  },
  URL_PATTERN: [
    '/action/content/v3/unlisted/publish/:contentId',
    '/action/questionset/v2/publish/:do_id',
    '/action/question/v2/publish/:do_id',
  ],
};

// Function to get the mapping value from FEATURE_LIST based on a given URL
function getMappingValue(url) {
  return FEATURE_LIST.URL[url] || null; // Return the mapping value or null if not found
}
module.exports = { FEATURE_LIST, getMappingValue };
