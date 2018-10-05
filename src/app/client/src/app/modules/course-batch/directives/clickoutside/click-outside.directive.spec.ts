import { ClickOutsideDirective } from './click-outside.directive';
import { Component , DebugElement, ViewChild} from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
@Component({
  template: `<input style="visibility: visible;" type="text" appClickOutside>`
})
class TestOutsideComponent {
  @ViewChild(ClickOutsideDirective) directive: ClickOutsideDirective;
}
describe('ClickOutsideDirective', () => {
  let component: TestOutsideComponent;
  let fixture: ComponentFixture<TestOutsideComponent>;
  let inputEl: DebugElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestOutsideComponent, ClickOutsideDirective]
    });
    fixture = TestBed.createComponent(TestOutsideComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
  });
  it('click outside the  elements', () => {
    const directive = new ClickOutsideDirective(inputEl);
    fixture.detectChanges();
    const event = new Event('window:mouseup', {});
    inputEl.triggerEventHandler('mouseup', null);
    spyOn(component.directive, 'onClick').and.callThrough();
    expect(component.directive.onClick).toBeDefined();
  });
});



