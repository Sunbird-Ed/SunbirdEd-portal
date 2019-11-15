import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLocationUpdateComponent } from './user-location-update.component';

xdescribe('UserLocationUpdateComponent', () => {
  let component: UserLocationUpdateComponent;
  let fixture: ComponentFixture<UserLocationUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLocationUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLocationUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
