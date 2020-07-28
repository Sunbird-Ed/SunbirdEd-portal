import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLandingSectionComponent } from './app-landing-section.component';

describe('AppLandingSectionComponent', () => {
  let component: AppLandingSectionComponent;
  let fixture: ComponentFixture<AppLandingSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLandingSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLandingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
