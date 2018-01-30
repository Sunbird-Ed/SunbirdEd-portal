'use strict'

angular.module('playerApp')
  .controller('TextBookController', ['contentService', '$timeout', '$state', 'config',
    '$rootScope', 'toasterService', 'searchService', 'configService', function (contentService, $timeout,
      $state, config, $rootScope, toasterService, searchService, configService) {
      var textbook = this
      textbook.categoryListofFramework = {}
      textbook.categoryModelList = {}
      textbook.formDropdown = configService.getWorkspaceFormDropdown()

      searchService.getChannel().then(function (res) {
        if (res.responseCode === 'OK') {
          textbook.frameworkId = res.result.channel.frameworks[0].identifier
          searchService.getFramework(textbook.frameworkId).then(function (res) {
            if (res.responseCode === 'OK') {
              textbook.frameworkData = res.result.framework.categories
              var categoryMasterList = _.cloneDeep(res.result.framework.categories)
              _.forEach(categoryMasterList, function (category) {
                textbook.categoryListofFramework[category.index] = category.terms || []
                var categoryName = 'category_' + category.index
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
        if (requestBody.language) {
          requestBody.language = [requestBody.language]
        }
        var requestData = {
          content: requestBody
        }
        textbook.createContent(requestData)
      }

      textbook.initEKStepCE = function (contentId) {
        var params = { contentId: contentId, type: 'TextBook', state: '', frameworkId: textbook.frameworkId }
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
        var category_1 = []
        var category_2 = []
        var category_3 = []
        var category_4 = []
        var categoryList = textbook.categoryListofFramework[categoryIndex]
        var associations = textbook.getAssociations(categoryVal, categoryList)
        if (associations.length > 0) {
          _.forEach(associations, function (data) {
            var catendex = _.findKey(textbook.categoryModelList, function (val, key) {
              return val === data.category
            })
            var categoryName = 'category_' + catendex
            switch (catendex) {
              case '1':
                $('.textbookmeta-category-1').dropdown('restore defaults')
                category_1 = _.concat(data, category_1)
                textbook[categoryName].terms = _.uniqWith(category_1, _.isEqual)
                break
              case '2':
                $('.textbookmeta-category-2').dropdown('restore defaults')
                category_2 = _.concat(data, category_2)
                textbook[categoryName].terms = _.uniqWith(category_2, _.isEqual)
                break
              case '3':
                $('.textbookmeta-category-3').dropdown('restore defaults')
                category_3 = _.concat(data, category_3)
                textbook[categoryName].terms = _.uniqWith(category_3, _.isEqual)
                break
              case '4':
                $('.textbookmeta-category-4').dropdown('restore defaults')
                category_4 = _.concat(data, category_4)
                textbook[categoryName].terms = _.uniqWith(category_4, _.isEqual)
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
              textbook['category_2'] = textbook.getTemsByindex(2)
              textbook['category_3'] = textbook.getTemsByindex(3)
              textbook['category_4'] = textbook.getTemsByindex(4)
              break
            case '2':
              setTimeout(function () {
                $('.textbookmeta-category-3').dropdown('restore defaults')
                $('.textbookmeta-category-4').dropdown('restore defaults')
              }, 0)
              textbook['category_3'] = textbook.getTemsByindex(3)
              textbook['category_4'] = textbook.getTemsByindex(4)
              break
            case '3':
              setTimeout(function () {
                $('.textbookmeta-category-4').dropdown('restore defaults')
              }, 0)
              textbook['category_4'] = textbook.getTemsByindex(4)
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
    }])
