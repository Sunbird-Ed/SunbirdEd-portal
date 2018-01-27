'use strict'

angular.module('playerApp')
  .controller('TextBookController', ['contentService', '$timeout', '$state', 'config',

    '$rootScope', 'toasterService', 'searchService', 'configService', 'telemetryService', function (contentService, $timeout,
      $state, config, $rootScope, toasterService, searchService, configService, telemetryService) {
      var textbook = this
      textbook.categoryListofFramework = {}
      textbook.formDropdown = configService.getWorkspaceFormDropdown()

      searchService.getChannel().then(function (res) {
        if (res && res.responseCode === 'OK' && _.get(res, 'result.channel.frameworks') &&
         _.get(res, 'result.channel.frameworks').length) {
          textbook.frameworkId = res.result.channel.frameworks[0].identifier
          textbook.version = res.ver
          searchService.getFramework(textbook.frameworkId).then(function (res) {
            if (res && res.responseCode === 'OK' && _.get(res, 'result.framework.categories') &&
              _.get(res, 'result.framework.categories').length) {
              textbook.frameworkData = res.result.framework.categories
              _.forEach(res.result.framework.categories, function (category) {
                textbook.categoryListofFramework[category.index] = category.terms
              })

              textbook.boardList = textbook.categoryListofFramework['1'] || []
              textbook.gradeList = textbook.categoryListofFramework['2'] || []
              textbook.subjectList = textbook.categoryListofFramework['3'] || []
              textbook.languageList = textbook.categoryListofFramework['4'] || []
            }
          }).catch(function (error) {
            console.log('error is ......', error)
          })
        }
      }).catch(function (error) {
        console.log('error is ......', error)
      })
      textbook.years = textbook.formDropdown.years
      textbook.showCreateTextBookModal = false
      textbook.isTextBookCreated = false
      textbook.userId = $rootScope.userId
      textbook.mimeType = 'application/vnd.ekstep.content-collection'
      textbook.defaultName = 'Untitled textbook'
      textbook.contentType = 'TextBook'

      textbook.hideCreateTextBookModal = function () {
        $('#createTextBookModal').modal('hide')
        $('#createTextBookModal').modal('hide others')
        $('#createTextBookModal').modal('hide dimmer')
      }

      textbook.initializeModal = function () {
        textbook.showCreateTextBookModal = true
        textbook.generateImpressionEvent('view', '', 'workspace-create-textbook', '/create/textbook')
        $timeout(function () {
          $('#textbookmeta-board').dropdown()
          $('#textbookmeta-subject').dropdown()
          $('#textbookmeta-medium').dropdown()
          $('#boardDropDown').dropdown()
          $('#mediumDropDown').dropdown()
          $('#subjectDropDown').dropdown()
          $('#textbookmeta-gradeLevel').dropdown()
          $('#yearDropDown').dropdown()
          $('#createTextBookModal').modal({
            onHide: function () {
              textbook.data = {}
              if (!textbook.isTextBookCreated) {
                $state.go('WorkSpace.ContentCreation')
              }
            }
          }).modal('show')
        }, 10)
      }

      textbook.createContent = function (requestData) {
        textbook.loader = toasterService.loader('', $rootScope.messages.stmsg.m0014)
        contentService.create(requestData).then(function (res) {
          if (res && res.responseCode === 'OK') {
            textbook.isTextBookCreated = true
            textbook.showCreateTextBookModal = false
            textbook.loader.showLoader = false
            textbook.hideCreateTextBookModal()
            textbook.generateInteractEvent('create-textbook', 'workspace-create-textbook',
              res.result.content_id, 'workspace')
            textbook.initEKStepCE(res.result.content_id)
          } else {
            textbook.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0008)
          }
        }).catch(function () {
          textbook.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0008)
        })
      }

      textbook.saveMetaData = function (data) {
        var requestBody = angular.copy(data)
        requestBody.name = requestBody.name ? requestBody.name : textbook.defaultName
        requestBody.mimeType = textbook.mimeType
        requestBody.createdBy = textbook.userId
        requestBody.contentType = textbook.contentType
        if (requestBody.language) {
          requestBody.language = [requestBody.language]
        }
        var requestData = {
          content: requestBody
        }
        textbook.createContent(requestData)
      }

      textbook.initEKStepCE = function (contentId) {
        var params = { contentId: contentId, type: 'TextBook', frameworkId: textbook.frameworkId }
        $state.go('CollectionEditor', params)
      }
      textbook.getAssociations = function (selectedCategory, categoryList) {
        var associations = []
        if (_.isArray(selectedCategory)) {
          _.forEach(selectedCategory, function (val) {
            var categoryObj = _.find(categoryList, function (o) {
              return o.name === val
            })
            if (categoryObj.associations) {
              associations = _.concat(categoryObj.associations, associations)
            }
          })
        } else {
          var categoryObj = _.find(categoryList, function (o) {
            return o.name === selectedCategory
          })
          if (categoryObj.associations) {
            associations = _.concat(categoryObj.associations, associations)
          }
        }
        return associations
      }

      textbook.updatedDependentCategory = function (category, categoryVal) {
        var gradeList = []
        var subjectList = []
        var mediumList = []
        var categoryList = textbook.categoryListofFramework[category]
        var associations = textbook.getAssociations(categoryVal, categoryList)
        if (associations.length > 0) {
          _.forEach(associations, function (data) {
            switch (data.category) {
            case 'class':
              $('#textbookmeta-gradeLevel').dropdown('restore defaults')
              gradeList = _.concat(data, gradeList)
              textbook.gradeList = _.uniqWith(gradeList, _.isEqual)
              break
            case 'subject':
              $('#textbookmeta-subject').dropdown('restore defaults')
              $('#textbookmeta-medium').dropdown('restore defaults')
              subjectList = _.concat(data, subjectList)
              textbook.subjectList = _.uniqWith(subjectList, _.isEqual)
              break
            case 'medium':
              $('#textbookmeta-medium').dropdown('restore defaults')
              mediumList = _.concat(data, mediumList)
              textbook.languageList = _.uniqWith(mediumList, _.isEqual)
              break
            }
          })
        } else {
          switch (category) {
          case '2':
            // $('#textbookmeta-gradeLevel').dropdown('restore defaults')
            $('#textbookmeta-subject').dropdown('restore defaults')
            $('#textbookmeta-medium').dropdown('restore defaults')
            textbook.subjectList = textbook.categoryListofFramework['3'] || []
            textbook.languageList = textbook.categoryListofFramework['4'] || []
            break
          case '3':
            $('#textbookmeta-medium').dropdown('restore defaults')
            textbook.languageList = textbook.categoryListofFramework['4'] || []
            break
          }
        }
      }

      //telemetry impression event//
      textbook.generateImpressionEvent = function(type, subtype, pageId, url){
          var contextData = {
              env : 'workspace',
              rollup: telemetryService.getRollUpData($rootScope.organisationIds)
            }
          var objRollup = ['textBook',$rootScope.userId]
          var objectData = {
              id: $rootScope.userId,
              type:'textBook',
              ver:textbook.version,
              rollup:telemetryService.getRollUpData(objRollup)
          }
          var data = {
            edata:telemetryService.impressionEventData(type, subtype, pageId, url),
            context: telemetryService.getContextData(contextData),
            object: telemetryService.getObjectData(objectData),
            tags: $rootScope.organisationIds
          }
          telemetryService.impression(data)
      }

        //telemetry interact event
        textbook.generateInteractEvent = function(edataId, pageId, contentId, env) {
          var contextData = {
              env : env,
              rollup: telemetryService.getRollUpData($rootScope.organisationIds)
              }
              var objectData = {
                id: contentId,
                type:edataId,
                ver:textbook.version
              }

              var data = {
                edata:telemetryService.interactEventData('CLICK', '', id, pageId),
                context: telemetryService.getContextData(contextData),
                object: telemetryService.getObjectData(objectData),
                tags: $rootScope.organisationIds
              }
              telemetryService.interact(data)
        }
    }])
