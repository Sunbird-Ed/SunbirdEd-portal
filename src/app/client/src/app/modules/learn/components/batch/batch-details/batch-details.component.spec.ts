import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BatchDetailsComponent } from './batch-details.component';
import {SharedModule} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';

describe('BatchDetailsComponent', () => {
  let component: BatchDetailsComponent;
  let fixture: ComponentFixture<BatchDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, CoreModule],
      declarations: [ BatchDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
