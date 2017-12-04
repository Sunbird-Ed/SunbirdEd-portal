'use strict';

(function () {
  angular.module('loginApp').controller('CollectionPlayerCtrl', ['$state', '$timeout',
    'contentService', '$rootScope', '$stateParams',
    function ($state, $timeout, contentService, $rootScope, $stateParams) {
      var cpvm = this
      cpvm.treeKey = 0
      cpvm.loader = {
        showLoader: false,
        loaderMessage: '',
        enrollLoader: false
      }
      cpvm.error = {
        showError: false,
        message: '',
        messageType: 'error',
        isClose: false,
        showEnrollError: false
      }
      cpvm.collectionMeta = {
        author: '-',
        language: '-',
        gradeLevel: '-',
        subject: '-',
        medium: '-',
        lastUpdatedOn: '-',
        createdOn: '-'
      }
      cpvm.showPlayer = false
      cpvm.name = $state.params.name
      $rootScope.titleName = cpvm.name
      cpvm.loadData = function () {
        cpvm.loader.showLoader = true
        cpvm.loader.loaderMessage = $rootScope.messages.stmsg.m0076
        contentService.courseHierarchy($state.params.contentId).then(function (res) {
          if (res && res.responseCode === 'OK') {
            cpvm.loader.showLoader = false
            res.result.content.children = _.sortBy(res.result.content.children,
                        ['index'])
            cpvm.courseHierachy = res.result.content
            cpvm.collectionMeta.author = cpvm.courseHierachy.owner
            cpvm.collectionMeta.language = cpvm.courseHierachy.language
            cpvm.collectionMeta.gradeLevel = cpvm.courseHierachy.gradeLevel
            cpvm.collectionMeta.subject = cpvm.courseHierachy.subject
            cpvm.collectionMeta.medium = cpvm.courseHierachy.medium
            cpvm.collectionMeta.lastUpdatedOn = cpvm.courseHierachy.lastUpdatedOn
            cpvm.collectionMeta.createdOn = cpvm.courseHierachy.createdOn
            cpvm.applyAccordion()
          } else {
            cpvm.showError($rootScope.messages.emsg.m0004)
          }
        }, function () {
          cpvm.showError($rootScope.messages.emsg.m0004)
        })
      }
      cpvm.constructTree = function (pos, cpvmData) {
        cpvm.fancyTree = []
        angular.forEach(cpvmData, function (item, child) {
          cpvm.getTreeData(item, cpvm.fancyTree)
        })
        cpvm.initializeFancyTree('#FT_' + pos, cpvm.fancyTree)
      }
      cpvm.getTreeData = function (contentData, parent) {
        if (contentData.mimeType !== 'application/vnd.ekstep.content-collection') {
          parent.push({
            title: '<span id=\'node' + cpvm.treeKey +
                                '\' class=\'padded\'><i class=\'' +
                                cpvm.getContentIcon(contentData.mimeType) + '\'></i>' +
                                contentData.name + '</span>',
            key: cpvm.treeKey,
            data: contentData,
            icon: false
          })
          cpvm.treeKey += 1
        } else {
          parent.push({
            title: '<span class=\'courseAccordianDesc\'><i class=\'' +
                                cpvm.getContentIcon(contentData.mimeType) +
                                '\'></i>' + contentData.name + '</span>',
            key: -1,
            children: [],
            icon: false
          })
          angular.forEach(contentData.children, function (child, item) {
            cpvm.getTreeData(contentData.children[item]
                        , parent[parent.length - 1].children)
          })
        }
        return cpvm.fancyTree
      }
      cpvm.initializeFancyTree = function (id, src) {
        $timeout(function () {
          $(id).fancytree({
            checkbox: false,
            source: src,
            click: function (event, data) {
              var nodeData = data.node
              if (nodeData.key !== -1) {
                cpvm.expandMe(nodeData.key, nodeData.data)
              }
            },
            create: function (evt, data) {
              $('.fancytree-container').addClass('fancytree-connectors')
            }
          })
        }, 0)
      }
      cpvm.expandMe = function (index, item) {
        if (item && item.mimeType && item.mimeType !== 'application/vnd.ekstep.content-collection') {
          cpvm.playContent(item)
        } else {
          var accIcon = $(index.target).closest('.title').find('i')
          cpvm.updateIcon(accIcon, !$(accIcon).hasClass('plus'))
        }
      }

      cpvm.getContentIcon = function (contentMimeType) {
        var contentIcons = {
          'application/pdf': 'large file pdf outline icon',
          'image/jpeg': 'large file image outline icon',
          'image/jpg': 'large file image outline icon',
          'image/png': 'large file image outline icon',
          'video/mp4': 'large file video outline icon',
          'video/ogg': 'large file video outline icon',
          'video/youtube': 'large youtube square icon',
          'application/vnd.ekstep.html-archive': 'large html5 icon',
          'application/vnd.ekstep.ecml-archive': 'large file archive outline icon',
          'application/vnd.ekstep.content-collection': 'large folder open outline icon grey icon'
        }
        return contentIcons[contentMimeType]
      }
      cpvm.updateIcon = function (icon, isPlus) {
        if (isPlus) {
          $(icon).addClass('plus').removeClass('minus')
        } else {
          $(icon).addClass('minus').removeClass('plus')
        }
      }
      cpvm.applyAccordion = function () {
        $timeout(function () {
          $('.ui.accordion').accordion({
            exclusive: false
          })
        }, 100)
      }
      cpvm.playContent = function (item) {
        cpvm.contentId = item.identifier
        cpvm.showPlayer = true
      }
      cpvm.closePlayer = function () {
        if ($stateParams.backState === 'Profile') {
          $state.go($stateParams.backState)
          return
        }
        if ($rootScope.search.searchKeyword !== '') {
          $timeout(function () {
            $rootScope.$emit('initSearch', {})
          }, 0)
        } else {
          $state.go('Resources')
        }
      }
      cpvm.loadData()
    }])
}())
