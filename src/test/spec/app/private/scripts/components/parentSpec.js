describe('Component: parent', function () {
  beforeEach(module('playerApp'))
  var element
  var scope
  var ctrl
  beforeEach(inject(function ($rootScope, $compile, _$componentController_) {
    scope = $rootScope.$new()
    element = angular.element('<parent config = "config"><geo></geo></parent>')
    $compile(element)(scope)
    scope.$digest()
    var mockRouteParams = {id: 1 }
    ctrl = _$componentController_('parent', {$routeParams: mockRouteParams }, null)
    ctrl.config = {
      'geo': {
        'adopter': 'SERVICE',
        'service': 'geoService'
      }
    }
  }))

  it('should invoke parent comp initialization', function () {
    spyOn(ctrl, '$onInit').and.callThrough()
    ctrl.$onInit()
    expect(ctrl.config).toBeDefined()
  })

  describe('SetItem:', function () {
    it('Should invoke setItem  ', function () {
      spyOn(ctrl, 'setItem').and.callThrough()
      ctrl.setItem({})
      expect(ctrl.setItem).toHaveBeenCalled()
    })

    it('Should set parent item when slelected item is not undefined or empty', function () {
      var item = {geo: {Name: 'Place', Id: '12-00-33'}}
      spyOn(ctrl, 'setItem').and.callThrough()
      ctrl.setItem(item)
      expect(ctrl.setItem).toHaveBeenCalledWith(item)
      expect(_.size(ctrl.items)).not.toEqual(0)
    })

    it('Should not set parent item, when selected items are empty/undefined', function () {
      var item
      spyOn(ctrl, 'setItem').and.callThrough()
      ctrl.setItem(item)
      expect(ctrl.setItem).toHaveBeenCalled()
      expect(_.size(ctrl.items)).toEqual(0)
    })
  })
})
