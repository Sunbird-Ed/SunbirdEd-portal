import { DesktopOnlyDirective } from './desktop-only.directive';
import { TemplateRef, ViewContainerRef, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { configureTestSuite } from '@sunbird/test-util';

@Component({
  template: '<p *appDesktopOnly>Testing Directives is awesome!</p>'
})
class TestComponent {
}

describe('DesktopOnlyDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        DesktopOnlyDirective
      ],
      imports: [CommonModule]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    const debugEl: HTMLElement = fixture.debugElement.nativeElement;
    const directive = new DesktopOnlyDirective(TemplateRef as any, ViewContainerRef as any);
    const p: HTMLElement = debugEl.querySelector('p');
    expect(component).toBeDefined();
    expect(directive['hasView']).toBe(false);
  });
});
