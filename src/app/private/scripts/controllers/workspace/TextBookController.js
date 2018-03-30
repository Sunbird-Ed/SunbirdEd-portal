'use strict'

angular.module('playerApp')
  .controller('TextBookController', ['contentService', '$timeout', '$state', 'config',
    '$rootScope', 'toasterService', 'searchService', 'configService', 'telemetryService',
    function (contentService, $timeout, $state, config, $rootScope, toasterService,
      searchService, configService, telemetryService) {
      var textbook = this
      textbook.categoryListofFramework = {}
      textbook.categoryModelList = {}
      textbook.formDropdown = configService.getWorkspaceFormDropdown()

      textbook.getChannel = function () {
        searchService.getChannel().then(function (res) {
          if (res.responseCode === 'OK') {
            textbook.version = res.ver
            textbook.framework = null
            if (_.get(res, 'result.channel.frameworks') && res.result.channel.frameworks.length > 0) {
              textbook.framework = res.result.channel.frameworks[0].identifier
            } else {
              textbook.framework = _.find(res.result.channel.suggested_frameworks, function (framework) {
                return framework.identifier === res.result.channel.defaultFramework
              }).identifier
            }
            searchService.getFramework(textbook.framework).then(function (res) {
              if (res.responseCode === 'OK') {
                textbook.frameworkData = res.result.framework.categories
                var categoryMasterList = _.cloneDeep(res.result.framework.categories)
                _.forEach(categoryMasterList, function (category) {
                  textbook.categoryListofFramework[category.index] = category.terms || []
                  var categoryName = 'category' + category.index
                  textbook[categoryName] = category
                  textbook.categoryModelList[category.index] = category.code
                })
              }
            }).catch(function (error) {
              console.log('error is ......', error)
            })
          }
        }).catch(function (error) {
          console.log('error is ......', error)
        })
      }
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
        telemetryService.impressionTelemetryData('workspace', '', 'textbook', '1.0', 'scroll',
          'workspace-create-textbook', '/create/textbook')
        $timeout(function () {
          $('#textbookmeta-category-1').dropdown('set selected', textbook[textbook.categoryModelList[1]])
          $('#textbookmeta-category-2').dropdown('set selected', textbook[textbook.categoryModelList[2]])
          $('#textbookmeta-category-3').dropdown('set selected', textbook[textbook.categoryModelList[3]])
          $('#textbookmeta-category-4').dropdown('set selected', textbook[textbook.categoryModelList[4]])
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
            telemetryService.interactTelemetryData('workspace', res.result.content_id, 'create-textbook',
              textbook.version, 'create-textbook', 'workspace-create-textbook')
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

      textbook.saveMetaData = function (data, textData) {
        var requestBody = angular.copy(data)
        requestBody.name = requestBody.name ? requestBody.name : textbook.defaultName
        requestBody.mimeType = textbook.mimeType
        requestBody.createdBy = textbook.userId
        requestBody.contentType = textbook.contentType
        requestBody.framework = textbook.framework
        if (requestBody.gradeLevel && requestBody.gradeLevel[0] === '') {
          delete requestBody['gradeLevel']
        }
        if (requestBody.language) {
          requestBody.language = [requestBody.language]
        }
        var requestData = {
          content: requestBody
        }
        textbook.createContent(requestData)
      }

      textbook.initEKStepCE = function (contentId) {
        var params = { contentId: contentId, type: 'TextBook', state: '', framework: textbook.framework }
        $state.go('CollectionEditor', params)
      }
      textbook.getAssociations = function (selectedCategory, categoryList) {
        var associations = []
        if (_.isArray(selectedCategory)) {
          _.forEach(selectedCategory, function (val) {
            var categoryObj = _.find(categoryList, function (o) {
              return o.name === val
            })
            if (categoryObj && categoryObj.associations) {
              associations = _.concat(categoryObj.associations, associations)
            }
          })
        } else if (selectedCategory) {
          var categoryObj = _.find(categoryList, function (o) {
            return o.name === selectedCategory
          })
          if (categoryObj && categoryObj.associations) {
            associations = categoryObj.associations || []
          }
        }
        return associations
      }
      textbook.updatedDependentCategory = function (categoryIndex, categoryVal) {
        var category1 = []
        var category2 = []
        var category3 = []
        var category4 = []
        var categoryList = textbook.categoryListofFramework[categoryIndex]
        var associations = textbook.getAssociations(categoryVal, categoryList)
        if (associations.length > 0) {
          _.forEach(associations, function (data) {
            var catendex = _.findKey(textbook.categoryModelList, function (val, key) {
              return val === data.category
            })
            var categoryName = 'category' + catendex
            switch (catendex) {
            case '1':
              $('.textbookmeta-category-1').dropdown('restore defaults')
              category1 = _.concat(data, category1)
              textbook[categoryName].terms = _.uniqWith(category1, _.isEqual)
              break
            case '2':
              $('.textbookmeta-category-2').dropdown('restore defaults')
              category2 = _.concat(data, category2)
              textbook[categoryName].terms = _.uniqWith(category2, _.isEqual)
              break
            case '3':
              $('.textbookmeta-category-3').dropdown('restore defaults')
              category3 = _.concat(data, category3)
              textbook[categoryName].terms = _.uniqWith(category3, _.isEqual)
              break
            case '4':
              $('.textbookmeta-category-4').dropdown('restore defaults')
              category4 = _.concat(data, category4)
              textbook[categoryName].terms = _.uniqWith(category4, _.isEqual)
              break
            }
          })
        } else {
          switch (categoryIndex) {
          case '1':
            setTimeout(function () {
              $('.textbookmeta-category-2').dropdown('restore defaults')
              $('.textbookmeta-category-3').dropdown('restore defaults')
              $('.textbookmeta-category-4').dropdown('restore defaults')
            }, 0)
            textbook['category2'] = textbook.getTemsByindex(2)
            textbook['category3'] = textbook.getTemsByindex(3)
            textbook['category4'] = textbook.getTemsByindex(4)
            break
          case '2':
            setTimeout(function () {
              $('.textbookmeta-category-3').dropdown('restore defaults')
              $('.textbookmeta-category-4').dropdown('restore defaults')
            }, 0)
            textbook['category3'] = textbook.getTemsByindex(3)
            textbook['category4'] = textbook.getTemsByindex(4)
            break
          case '3':
            setTimeout(function () {
              $('.textbookmeta-category-4').dropdown('restore defaults')
            }, 0)
            textbook['category4'] = textbook.getTemsByindex(4)
            break
          }
        }
      }

      textbook.getTemsByindex = function (index) {
        var masterList = _.cloneDeep(textbook.frameworkData)
        var category = _.find(masterList, function (o) {
          return o.index === index
        })
        return category
      }
      textbook.getChannel()
    }])
