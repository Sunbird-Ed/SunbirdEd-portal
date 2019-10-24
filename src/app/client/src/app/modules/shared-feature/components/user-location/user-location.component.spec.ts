import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLocationComponent } from './user-location.component';

describe('UserLocationComponent', () => {
  let component: UserLocationComponent;
  let fixture: ComponentFixture<UserLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
