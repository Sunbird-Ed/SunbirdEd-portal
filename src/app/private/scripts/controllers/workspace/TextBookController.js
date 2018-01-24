'use strict'

angular.module('playerApp')
  .controller('TextBookController', ['contentService', '$timeout', '$state', 'config',
    '$rootScope', '$scope', 'toasterService', 'searchService', 'configService', function (contentService, $timeout, $state, config,
      $rootScope, $scope, toasterService, searchService, configService) {
      var textbook = this
      $scope.categoryListofFramework = {}
      textbook.formDropdown = configService.getWorkspaceFormDropdown()

      searchService.getFrameworkID().then(function (res) {
        console.log('in get frameworkapi new', res.result.channel.frameworks[0].name)
        console.log('dropdown', res.result.channel.frameworks[0].name)
        if (res.responseCode === 'OK') {
          console.log('dropdown', res.result.channel.frameworks[0].name)
          console.log('dropdown frameworks', res.result.channel.frameworks)
          console.log('call api now')
          var frameworkID = res.result.channel.frameworks[0].name
          searchService.getFramework(frameworkID).then(function (res) {
            console.log('in get frameworkapi new', res)
            console.log('dropdown', res.result.framework.categories)
            if (res.responseCode === 'OK') {
              textbook.frameworkData = res.result.framework.categories
             // console.log('dropdown frameworks categories', res.result.framework.categories)
              _.forEach(res.result.framework.categories, function (category) {
                $scope.categoryListofFramework[category.code] = category.terms
                // console.log(_.groupBy(category.terms, 'category'))
                // console.log(_.minBy(category.terms, 'index'))
                var findAssociations = _.filter($scope.categoryListofFramework[category.code], 'associations')
                console.log(findAssociations)
                if (findAssociations.length > 0) {
                  console.log(findAssociations[0].index)
                  console.log(findAssociations[0].category)
                  textbook.findIndex = findAssociations[0].category
                }

                // console.log(_.filter($scope.categoryListofFramework[category.code], 'associations'))
              })

              $scope.boardList = $scope.categoryListofFramework['sets'] || []
              $scope.gradeList = $scope.categoryListofFramework['class'] || []
              $scope.subjectList = $scope.categoryListofFramework['subject'] || []
              $scope.languageList = $scope.categoryListofFramework['medium'] || []
            }
          }).catch(function (error) {
            console.log('error is ......', error)
          })
        }
      }).catch(function (error) {
        console.log('error is ......', error)
      })
      $scope.getAssociations = function (selectedCategory, categoryList) {
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

      $scope.updatedDependentCategory = function (category, categoryVal) {
        var gradeList = [],
          subjectList = [],
          mediumList = [],
          categoryList = $scope.categoryListofFramework[category],
          associations = $scope.getAssociations(categoryVal, categoryList)
        if (associations.length > 0) {
          _.forEach(associations, function (data) {
            switch (data.category) {
              case 'class':
                $('#textbookmeta-gradeLevel').dropdown('restore defaults')
                gradeList = _.concat(data, gradeList)
                $scope.gradeList = _.uniqWith(gradeList, _.isEqual)
                break
              case 'subject':
                $('#textbookmeta-subject').dropdown('restore defaults')
                $('#textbookmeta-medium').dropdown('restore defaults')
                subjectList = _.concat(data, subjectList)
                $scope.subjectList = _.uniqWith(subjectList, _.isEqual)
                break
              case 'medium':
                $('#textbookmeta-medium').dropdown('restore defaults')
                mediumList = _.concat(data, mediumList)
                $scope.languageList = _.uniqWith(mediumList, _.isEqual)
                break
            }
          })
        } else {
          switch (category) {
            case 'class':
              $('#textbookmeta-gradeLevel').dropdown('restore defaults')
              $('#textbookmeta-subject').dropdown('restore defaults')
              $('#textbookmeta-medium').dropdown('restore defaults')
              $scope.subjectList = $scope.categoryListofFramework['subject'] || []
              $scope.languageList = $scope.categoryListofFramework['medium'] || []
              break
            case 'subject':
              $('#textbookmeta-medium').dropdown('restore defaults')
              $scope.languageList = $scope.categoryListofFramework['medium'] || []
              break
          }
        }
      }

      textbook.getselectedGrade = function (data) {
        console.log('selected grade', data)

        data.forEach(function (item) {
          console.log()
          _.groupBy(item.associations, 'category')
          if (item.associations && item.associations.length > 0) {
            console.log('associations', item.associations)
            textbook.subjects = item.associations
          }
        })
      }
      textbook.boards = textbook.formDropdown.boards
      textbook.mediums = textbook.formDropdown.medium
      // textbook.subjects = textbook.formDropdown.subjects
     // textbook.grades = textbook.formDropdown.grades
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
    }])
