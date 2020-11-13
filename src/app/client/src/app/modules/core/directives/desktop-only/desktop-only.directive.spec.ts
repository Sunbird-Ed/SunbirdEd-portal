import { DesktopOnlyDirective } from './desktop-only.directive';
import { TemplateRef, ViewContainerRef } from '@angular/core';

fdescribe('DesktopOnlyDirective', () => {
  it('should create an instance', () => {
    const directive = new DesktopOnlyDirective(TemplateRef as any, ViewContainerRef as any);
    expect(directive).toBeTruthy();
  });
});
