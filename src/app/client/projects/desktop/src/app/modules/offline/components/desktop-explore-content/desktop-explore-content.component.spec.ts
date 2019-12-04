import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopExploreContentComponent } from './desktop-explore-content.component';

describe('DesktopExploreContentComponent', () => {
  let component: DesktopExploreContentComponent;
  let fixture: ComponentFixture<DesktopExploreContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopExploreContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopExploreContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
