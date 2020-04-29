import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSummaryModalComponent } from './add-summary-modal.component';

describe('AddSummaryModalComponent', () => {
  let component: AddSummaryModalComponent;
  let fixture: ComponentFixture<AddSummaryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSummaryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSummaryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
