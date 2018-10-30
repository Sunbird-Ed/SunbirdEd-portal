import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePageRedesignComponent } from './profile-page-redesign.component';

describe('ProfilePageRedesignComponent', () => {
  let component: ProfilePageRedesignComponent;
  let fixture: ComponentFixture<ProfilePageRedesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePageRedesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageRedesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
