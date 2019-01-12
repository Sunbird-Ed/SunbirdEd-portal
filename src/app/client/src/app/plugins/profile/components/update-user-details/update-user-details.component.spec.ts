import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserDetailsComponent } from './update-user-details.component';

describe('UpdateUserDetailsComponent', () => {
  let component: UpdateUserDetailsComponent;
  let fixture: ComponentFixture<UpdateUserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateUserDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
