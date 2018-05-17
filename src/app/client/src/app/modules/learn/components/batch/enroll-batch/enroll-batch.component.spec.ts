import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollBatchComponent } from './enroll-batch.component';

import { SuiModule } from 'ng2-semantic-ui';

import {SharedModule} from '@sunbird/shared';

import {CoreModule} from '@sunbird/core';

describe('EnrollBatchComponent', () => {
  let component: EnrollBatchComponent;
  let fixture: ComponentFixture<EnrollBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollBatchComponent ],
      imports: [SharedModule, CoreModule, SuiModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollBatchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
