import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAvtarComponent } from './user-avtar.component';

describe('UserAvtarComponent', () => {
  let component: UserAvtarComponent;
  let fixture: ComponentFixture<UserAvtarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAvtarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAvtarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
