
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

  describe('onExit', function () {
    it('should close the modal', function (done) {
      goFrom('/').toState('Courses', {})
      goFrom('/learn').toState('Home', {})
      done()
    })
  })

  describe('OnEnter', function () {
    it('should close the modal', function () {
      goFrom('/').toState('UserContent', {})
      goFrom('/').toState('Courses', {})
      goFrom('/').toState('Resources', {})
      goFrom('/course/note/123123').toState('CourseNote', {})
      goFrom('/').toState('Community', {})
    })

    describe('Search state', function () {
      it('On enter from course', function (done) {
        $stateParams.type = 'Courses'
        goFrom('/').toState('Search', $stateParams)
        done()
      })
      it('On enter from content', function (done) {
        $stateParams.type = 'Library'
        goFrom('/').toState('Search', $stateParams)
        done()
      })
      it('On enter from profile', function (done) {
        $stateParams.type = 'Users'
        goFrom('/').toState('Search', $stateParams)
        done()
      })
      it('On enter from profile', function (done) {
        $stateParams.type = 'Organisations'
        goFrom('/').toState('Search', $stateParams)
        done()
      })
    })

    it('On TocPlayer enter ', function (done) {
      $stateParams.type = 'Courses'
      goFrom('/').toState('TocPlayer', $stateParams)

      done()
    })

    it('On TocPlayer enter ', function (done) {
      $stateParams.type = 'Courses'
      goFrom('/').toState('WorkSpace', $stateParams)
      done()
    })

    it('On WorkSpace.ContentCreation enter ', function (done) {
      goFrom('/').toState('WorkSpace.ContentCreation', $stateParams)
      done()
    })

    it('On WorkSpace.UpForReviewContent enter ', function (done) {
      goFrom('/').toState('WorkSpace.UpForReviewContent', $stateParams)
      done()
    })

    it('On WorkSpace.FlaggedContent enter ', function (done) {
      goFrom('/').toState('WorkSpace.FlaggedContent', $stateParams)
      done()
    })

    it('On WorkSpace.ReviewContent enter ', function (done) {
      goFrom('/').toState('WorkSpace.ReviewContent', $stateParams)
      done()
    })

    it('On WorkSpace.AllUploadedContent enter ', function (done) {
      goFrom('/').toState('WorkSpace.AllUploadedContent', $stateParams)
      done()
    })

    it('On WorkSpace.BatchList enter ', function (done) {
      goFrom('/').toState('WorkSpace.BatchList', $stateParams)
      done()
    })

    it('On CreateTextbook enter ', function (done) {
      goFrom('/').toState('CreateTextbook', $stateParams)
      done()
    })

    it('On CreateTextbook enter ', function (done) {
      goFrom('/').toState('CreateTextbook', $stateParams)
      done()
    })

    it('On CreateTextbook enter ', function (done) {
      goFrom('/').toState('CreateTextbook', $stateParams)
      done()
    })

    it('On CreateLesson enter ', function (done) {
      goFrom('/').toState('CreateLesson', $stateParams)
      done()
    })

    it('On ContentEditor enter ', function (done) {
      goFrom('/CreateLesson').toState('ContentEditor', $stateParams)
      done()
    })

    it('On CreateCollection enter ', function (done) {
      goFrom('/ContentEditor').toState('CreateCollection', $stateParams)
      done()
    })

    it('On CreateCourse enter ', function (done) {
      goFrom('/CreateCollection').toState('CreateCourse', $stateParams)
      done()
    })

    it('On CreateCourse enter ', function (done) {
      goFrom('/CreateCourse').toState('CollectionEditor', $stateParams)
      done()
    })

    it('On PreviewContent enter ', function (done) {
      goFrom('/CollectionEditor').toState('PreviewContent', $stateParams)
      done()
    })

    it('On PreviewCollection enter ', function (done) {
      goFrom('/CollectionEditor').toState('PreviewCollection', $stateParams)
      done()
    })

    it('On orgDashboard enter ', function (done) {
      goFrom('/').toState('orgDashboard', $stateParams)
      done()
    })

    it('On CreateBatch enter ', function (done) {
      goFrom('/').toState('CreateBatch', $stateParams)
      done()
    })

    it('On updateBatch enter ', function (done) {
      goFrom('/').toState('updateBatch', $stateParams)
      done()
    })

    it('On CreateLessonPlan enter ', function (done) {
      goFrom('/').toState('CreateLessonPlan', $stateParams)
      done()
    })

    it('On GenericEditor enter ', function (done) {
      goFrom('/').toState('GenericEditor', $stateParams)
      done()
    })

    it('On PublicProfile enter ', function (done) {
      goFrom('/').toState('PublicProfile', $stateParams)
      done()
    })

    it('On MyActivity enter ', function (done) {
      goFrom('/').toState('MyActivity', $stateParams)
      done()
    })

    it('On Setup enter ', function (done) {
      goFrom('/').toState('Setup', $stateParams)
      done()
    })
  })
})
