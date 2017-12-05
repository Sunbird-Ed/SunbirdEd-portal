describe('Component: geo', function () {
  beforeEach(module('playerApp'))
  var element
  var scope
  var ctrl
  var rootScope
  beforeEach(inject(function ($rootScope, $compile, _$componentController_) {
    scope = $rootScope.$new()
    rootScope = $rootScope
    element = angular.element('<parent><geo></geo></parent>')
    $compile(element)(scope)
    scope.$digest()
    var mockRouteParams = {id: 1 }
    ctrl = _$componentController_('geo', {$routeParams: mockRouteParams }, null)
    ctrl.config = {'geo': {'adopter': 'SERVICE', 'service': 'geoService'} }; ctrl.parent = {}
    ctrl.parent.config = {'geo': {'adopter': 'SERVICE', 'service': 'geoService'}, 'org': {'adopter': 'JSON', 'json': [{name: 'Mysore', id: 'one'}, {name: 'Pavagada', id: 'two'}] } }
  }))

  it('should invoke geo comp dynamic initialize', function () {
    spyOn(ctrl, '$onInit').and.callThrough()
    spyOn(ctrl, 'initialize').and.callThrough()
    ctrl.$onInit()
    ctrl.initialize(ctrl.config)
    expect(ctrl.config).toBeDefined()
    expect(ctrl.initialize).toHaveBeenCalled()
  })

  it('should dispatch events, when geo initialize', function () {
    spyOn(ctrl, 'initialize').and.callThrough()
    ctrl.initialize(ctrl.config)
    expect(ctrl.initialize).toHaveBeenCalled()
    ctrl.parent.setItem = function () {
      console.info('Setting up parent comp')
    }
    rootScope.$emit('items:from:child')
  })

  it('Should validate the adopter when adopter is SERVICE', function () {
    spyOn(ctrl, 'validateAdopter').and.callThrough()
    ctrl.validateAdopter(ctrl.config.geo)
    expect(ctrl.validateAdopter).toHaveBeenCalled()
    ctrl.validateAdopter(ctrl.config.geo)
    spyOn(ctrl, 'initializeServiceAdopter').and.callThrough()
    ctrl.initializeServiceAdopter(ctrl.config.geo)
    expect(ctrl.initializeServiceAdopter).toHaveBeenCalled()
  })

  it('Should initialization the adopter when adopter is JSON', function () {
    ctrl.config = {'geo': {adopter: 'JSON', 'json': {'division1': 'Place1'} } }
    spyOn(ctrl, 'validateAdopter').and.callThrough()
    ctrl.validateAdopter(ctrl.config.geo)
    expect(ctrl.validateAdopter).toHaveBeenCalled()
    ctrl.validateAdopter(ctrl.config.geo)
    spyOn(ctrl, 'initializeJsonAdopter').and.callThrough()
    ctrl.initializeJsonAdopter(ctrl.config.geo)
    expect(ctrl.initializeJsonAdopter).toHaveBeenCalled()
  })

  it('Should not initialize when there is no valid adopter', function () {
    ctrl.config = {geo: {adopter: 'test'} }
    spyOn(ctrl, 'validateAdopter').and.callThrough()
    ctrl.validateAdopter(ctrl.config.geo)
    expect(ctrl.validateAdopter).toHaveBeenCalled()
  })

  it('Should return the selected item', function () {
    spyOn(ctrl, 'getSelectedItems').and.callThrough()
    ctrl.getSelectedItems()
    expect(ctrl.getSelectedItems).toHaveBeenCalled()
    expect(ctrl.getSelectedItems).not.toBe(null)
  })
})
