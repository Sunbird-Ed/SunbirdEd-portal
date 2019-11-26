import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopViewAllComponent } from './desktop-view-all.component';

describe('DesktopViewAllComponent', () => {
  let component: DesktopViewAllComponent;
  let fixture: ComponentFixture<DesktopViewAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopViewAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopViewAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
