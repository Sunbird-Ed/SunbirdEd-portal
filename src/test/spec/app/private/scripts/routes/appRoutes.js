
describe('controller test', function () {
  var $compile, $state, scope, httpMock, $location, $rootScope, $templateCache, $stateParams, $httpBackend

  beforeEach(module('playerApp'))

  beforeEach(inject(function (_$rootScope_, _$httpBackend_, _$state_, $controller, _$templateCache_, _$location_, _$stateParams_) {
    $state = _$state_
    $stateParams = _$stateParams_
    scope = _$rootScope_.$new()
    $templateCache = _$templateCache_
    $location = _$location_
    $rootScope = _$rootScope_
    $httpBackend = _$httpBackend_
  }))

  function mockTemplate (templateRoute, tmpl) {
    $templateCache.put(templateRoute, tmpl || templateRoute)
  }

  function goTo (url) {
    $location.url(url)
    $rootScope.$digest()
  }

  function goFrom (url) {
    return {toState: function (state, params) {
      $location.replace().url(url) // Don't actually trigger a reload
      $state.go(state, params)
      $rootScope.$digest()
    }}
  }

  function resolve (value) {
    return {forStateAndView: function (state, view) {
      var viewDefinition = view ? $state.get(state).views[view] : $state.get(state)
      return $injector.invoke(viewDefinition.resolve[value])
    }}
  }

  describe('OnEnter', function () {
    describe('Search state', function () {
      it('from course', function (done) {
        $stateParams.type = 'Courses'
        goFrom('/').toState('Search', $stateParams)
        done()
      })
      it('from content', function (done) {
        $stateParams.type = 'Library'
        goFrom('/').toState('Search', $stateParams)
        done()
      })
      it('from profile', function (done) {
        $stateParams.type = 'Users'
        goFrom('/').toState('Search', $stateParams)
        done()
      })
      it('from profile', function (done) {
        $stateParams.type = 'Organisations'
        goFrom('/').toState('Search', $stateParams)
        done()
      })
    })

    it('Community state ', function (done) {
      goFrom('/').toState('Community')
      done()
    })

    it('UserContent state ', function (done) {
      goFrom('/').toState('UserContent')
      done()
    })

    it('Resources state', function (done) {
      $stateParams.courseId = 'do_21323332333333332'
      goFrom('/').toState('Resources', $stateParams)
      expect($rootScope.isResourcesPage).toBeTruthy()
      done()
    })

    it('Courses state', function (done) {
      goFrom('/').toState('Courses')
      expect($rootScope.isLearnPage).toBeTruthy()
      done()
    })

    it('CourseNote state', function (done) {
      $stateParams.courseId = 'do_21323332333333332'
      goFrom('/').toState('CourseNote', $stateParams)
      expect($rootScope.isNotePage).toBeTruthy()
      done()
    })

    it('ContentNote state', function (done) {
      $stateParams.contentId = 'do_21323332333333332'
      $stateParams.contentName = 'y6'
      goFrom('/').toState('ContentNote', $stateParams)
      expect($rootScope.isNotePage).toBeTruthy()
      done()
    })

    it('CourseContentNote state', function (done) {
      $stateParams.courseId = 'do_21323332333333332'
      $stateParams.contentId = 'do_21323332333333332'
      $stateParams.contentName = 'y6'
      goFrom('/').toState('CourseContentNote', $stateParams)
      expect($rootScope.isNotePage).toBeTruthy()
      done()
    })

    it('TocPlayer state', function (done) {
      $stateParams.courseId = 'do_21323332333333332'
      $stateParams.contentId = 'do_21323332333333332'
      $stateParams.lectureView = 'yes'
      $stateParams.contentIndex = 1
      goFrom('/').toState('TocPlayer', $stateParams)
      expect($rootScope.isTocPage).toBeTruthy()
      done()
    })

    it('TocPlayer state', function (done) {
      $stateParams.type = 'Courses'
      goFrom('/').toState('WorkSpace', $stateParams)
      done()
    })

    it('Profile state', function (done) {
      goFrom('/').toState('Profile')
      expect($rootScope.profileActive).toBe('active')
      done()
    })

    it('Player state', function (done) {
      $stateParams.contentId = 'do_21323332333333332'
      $stateParams.contentName = 'y6'
      goFrom('/').toState('Player', $stateParams)
      expect($rootScope.isPlayerPage).toBeTruthy()
      done()
    })

    it('WorkSpace.ContentCreation state', function (done) {
      goFrom('/profile').toState('WorkSpace.ContentCreation')
      done()
    })

    it('WorkSpace.UpForReviewContent state', function (done) {
      goFrom('/').toState('WorkSpace.UpForReviewContent')
      done()
    })

    it('WorkSpace.FlaggedContent state', function (done) {
      goFrom('/').toState('WorkSpace.FlaggedContent')
      done()
    })

    it('WorkSpace.ReviewContent state', function (done) {
      goFrom('/').toState('WorkSpace.ReviewContent')
      done()
    })

    it('WorkSpace.AllUploadedContent state', function (done) {
      goFrom('/').toState('WorkSpace.AllUploadedContent')
      done()
    })

    it('WorkSpace.BatchList state', function (done) {
      goFrom('/').toState('WorkSpace.BatchList')
      done()
    })

    it('CreateTextbook state', function (done) {
      goFrom('/').toState('CreateTextbook')
      done()
    })

    it('CreateTextbook state', function (done) {
      goFrom('/').toState('CreateTextbook')
      done()
    })

    it('CreateTextbook state', function (done) {
      goFrom('/').toState('CreateTextbook')
      done()
    })

    it('CreateLesson state', function (done) {
      goFrom('/').toState('CreateLesson')
      expect($rootScope.profileActive).toBe('active')
      done()
    })

    it('ContentEditor state', function (done) {
      goFrom('/CreateLesson').toState('ContentEditor')
      expect($rootScope.profileActive).toBe('active')
      done()
    })

    it('CreateCollection state', function (done) {
      goFrom('/ContentEditor').toState('CreateCollection')
      expect($rootScope.profileActive).toBe('active')
      done()
    })

    it('CreateCourse state', function (done) {
      goFrom('/CreateCollection').toState('CreateCourse')
      expect($rootScope.profileActive).toBe('active')
      done()
    })

    it('CreateCourse state', function (done) {
      goFrom('/CreateCourse').toState('CollectionEditor')
      expect($rootScope.profileActive).toBe('active')
      done()
    })

    it('PreviewContent state', function (done) {
      goFrom('/CollectionEditor').toState('PreviewContent')
      expect($rootScope.profileActive).toBe('active')
      done()
    })

    it('PreviewCollection state from Profile', function (done) {
      $stateParams.backState = 'Profile'
      goFrom('/CollectionEditor').toState('PreviewCollection', $stateParams)
      expect($rootScope.profileActive).toBe('active')
      done()
    })

    it('PreviewCollection state from ', function (done) {
      $stateParams.backState = 'Resource'
      goFrom('/CollectionEditor').toState('PreviewCollection', $stateParams)
      expect($rootScope.resourcesActive).toBe('active')
      done()
    })

    it('orgDashboard state', function (done) {
      goFrom('/').toState('orgDashboard')
      done()
    })

    it('CreateBatch state', function (done) {
      $stateParams.courseId = 'do_21323332333333332'
      goFrom('/').toState('CreateBatch', $stateParams)
      done()
    })

    it('updateBatch state', function (done) {
      goFrom('/').toState('updateBatch')
      done()
    })

    it('CreateLessonPlan state', function (done) {
      goFrom('/').toState('CreateLessonPlan')
      expect($rootScope.profileActive).toBe('active')
      done()
    })

    it('GenericEditor state', function (done) {
      goFrom('/').toState('GenericEditor')
      expect($rootScope.profileActive).toBe('active')
      done()
    })

    it('PublicProfile state', function (done) {
      goFrom('/').toState('PublicProfile')
      expect($rootScope.profileActive).toBe('active')
      done()
    })

    it('MyActivity state', function (done) {
      goFrom('/').toState('MyActivity')
      done()
    })

    it('Setup state', function (done) {
      goFrom('/').toState('Setup')
      done()
    })
  })

  it('WorkSpace.LimitedPublishedContent state', function (done) {
    goFrom('/').toState('WorkSpace.LimitedPublishedContent')
    done()
  })

  describe('onExit', function () {
    it('Setup state', function (done) {
      goFrom('/learn').toState('Home', {})
      done()
    })
  })
})
