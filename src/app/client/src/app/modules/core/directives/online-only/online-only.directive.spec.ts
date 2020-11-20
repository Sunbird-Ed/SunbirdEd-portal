import { TestBed, ComponentFixture } from '@angular/core/testing';
import { OnlineOnlyDirective } from './online-only.directive';
import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { ToasterService, ResourceService, ConnectionService } from '@sunbird/shared';

// Simple test component that will not in the actual app
@Component({
  template: '<p appOnlineOnly [showWarningMessage]="true">Testing Directives is awesome!</p>'
})
class TestComponent {
  clickCount = 0;

  constructor() { }

  // allows us to listen to click events on the main wrapper element of our component
  @HostListener('click')
  onClick() {
    this.clickCount = ++this.clickCount; // increment clickCount
  }
}

describe('OnlineOnlyDirective', () => {
  const resourceMockData = {
    messages: {
      fmsg: { m0097: 'Something went wrong' },
      stmsg: { desktop: { onlineStatus: 'You are online' } },
      emsg: { desktop: { onlineStatus: 'You are offline' } }
    }
  };
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        OnlineOnlyDirective
      ],
      providers: [ToasterService, { provide: ResourceService, useValue: resourceMockData }]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should show the online-only tags', () => {
    const debugEl: HTMLElement = fixture.debugElement.nativeElement;
    const p: HTMLElement = debugEl.querySelector('p');

    // change clickCount to 1 and capitalize text
    p.click();
    fixture.detectChanges();

    expect(component.clickCount).toEqual(1);
  });
});
