import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyContactTypeComponent } from './verify-contact-type.component';

describe('VerifyContactTypeComponent', () => {
  let component: VerifyContactTypeComponent;
  let fixture: ComponentFixture<VerifyContactTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyContactTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyContactTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
