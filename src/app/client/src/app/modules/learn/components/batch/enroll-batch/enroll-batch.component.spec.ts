import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollBatchComponent } from './enroll-batch.component';

describe('EnrollBatchComponent', () => {
  let component: EnrollBatchComponent;
  let fixture: ComponentFixture<EnrollBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
