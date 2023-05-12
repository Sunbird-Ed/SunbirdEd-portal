import { DesktopOnlyDirective } from './desktop-only.directive';
import { TemplateRef, ViewContainerRef, Component } from '@angular/core';
import { environment } from '@sunbird/environment';

@Component({
  template: '<p *appDesktopOnly>Testing Directives is awesome!</p>'
})
class TestComponent {
}

describe('DesktopOnlyDirective', () => {
  let component: TestComponent;
  beforeAll(() => {
    component = new TestComponent();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create component', () => {
    const directive = new DesktopOnlyDirective(TemplateRef as any, ViewContainerRef as any);
    expect(component).toBeDefined();
    expect(directive['hasView']).toBe(false);
  });
});
