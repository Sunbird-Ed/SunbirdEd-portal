'use strict'

angular.module('playerApp')
    .service('configService', ['httpService', 'config', '$q',
      function (httpService, config, $q) {
     /**
     * @class configService
     */
            /**
             * @method getProfileAddInfformElmnt
             * @get form dropdown value
             */

        this.getProfileAddInfformElmnt = function () {
          return {
            'languages': config.DROPDOWN.COMMON.languages,
            'subjects': config.DROPDOWN.COMMON.subjects,
            'grades': config.DROPDOWN.COMMON.grades
          }
        }

            /**
             * @method getWorkspaceBookDrpdown
             * @get Create Study Material form dropdown value
             */

        this.getWorkspaceStdMtrlDrpdown = function () {
          return {
            'boards': config.DROPDOWN.COMMON.boards,
            'medium': config.DROPDOWN.COMMON.medium,
            'subjects': config.DROPDOWN.COMMON.subjects,
            'grades': config.DROPDOWN.COMMON.grades,
            'resourceType': config.FILTER.RESOURCES.resourceType
          }
        }

            /**
               * @method getWorkspaceFormDropdown
               * @get workspace form dropdown value
               * @to create Book and lesson plan
               */

        this.getWorkspaceFormDropdown = function () {
          return {
            'boards': config.DROPDOWN.COMMON.boards,
            'medium': config.DROPDOWN.COMMON.medium,
            'subjects': config.DROPDOWN.COMMON.subjects,
            'grades': config.DROPDOWN.COMMON.grades
          }
        }

            /**
               * @method getWorkspaceUpforReviewdrpdwn
               * @get workspace form dropdown value
               * @to filter up for review content
               */

        this.getWorkspaceUpforReviewdrpdwn = function () {
          return {
            'boards': config.DROPDOWN.COMMON.boards,
            'medium': config.DROPDOWN.COMMON.medium,
            'languages': config.DROPDOWN.COMMON.languages,
            'subjects': config.DROPDOWN.COMMON.subjects,
            'grades': config.DROPDOWN.COMMON.grades,
            'contentTypes': config.FILTER.RESOURCES.contentTypes
          }
        }

            /**
               * @method getFilterSearchdrpdwn
               * @get search filter dropdown value
               * @for filter courses and library
               */

        this.getFilterSearchdrpdwn = function () {
          return {
            'boards': config.DROPDOWN.COMMON.boards,
            'medium': config.DROPDOWN.COMMON.medium,
            'subjects': config.DROPDOWN.COMMON.subjects,
            'languages': config.DROPDOWN.COMMON.languages,
            'contentTypes': config.FILTER.RESOURCES.contentTypes,
            'grades': config.DROPDOWN.COMMON.grades,
            'searchTypeKeys': config.searchTypeKeys,
            'sortingOptions': config.sortingOptions,
            'searchSelectionKeys': config.searchSelectionKeys
          }
        }
      }])
