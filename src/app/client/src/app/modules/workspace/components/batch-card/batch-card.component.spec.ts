import { UpdateBatchComponent } from './../update-batch/update-batch.component';

import { BatchCardComponent } from './batch-card.component';
// Import NG testing module(s)
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { FormsModule, NgForm, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { NO_ERRORS_SCHEMA } from '@angular/core';
// Import services
import { SharedModule, PaginationService, ToasterService, ResourceService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService, BatchService} from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { Observable, of } from 'rxjs';
import { Response } from './batch-card.component.spec.data';
// import batch card comoponet
// Import Module
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
// Test data
describe('BatchCardComponent', () => {
  let component: BatchCardComponent;
  let fixture: ComponentFixture<BatchCardComponent>;
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0056': 'Fetching draft content failed, please try again',
        'm0004': ''
      },
      'stmsg': {
        'm0108': 'We are fetching batchlist...',
        'm0008': 'no-results',
        'm0020': 'You dont have any batch list...'
      },
      'smsg': {
        'm0006': 'Content deleted successfully...'
      }
    }
  };
 const fakeActivatedRoute = { 'params': of([{ 'batchId': '0124858228063600641' }]) };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BatchCardComponent, UpdateBatchComponent],
      imports: [SuiModule, FormsModule, ReactiveFormsModule,
        HttpClientTestingModule, Ng2IziToastModule, SharedModule.forRoot(), TelemetryModule.forRoot()],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService, ResourceService, ToasterService,
        BatchService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchCardComponent);
    component = fixture.componentInstance;
  });

  it('should take Batch INPUT', () => {
    component.batch = Response.successData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .batch-content-description').innerText).toEqual('FSDF');
  });
  it('should set batchDetails', inject([Router],
    (route) => {
    spyOn(component, 'onAction').and.callThrough();
    component.onAction(Response.successData);
    component.batch = Response.successData;
    const batchService = TestBed.get(BatchService);
    batchService.batchDetails = Response.successData;
    spyOn(batchService, 'setBatchData').and.callThrough();
    batchService.setBatchData(Response.successData);
    expect(batchService.setBatchData).toHaveBeenCalledWith(Response.successData);
    expect(route.navigate).toHaveBeenCalledWith(['update/batch', Response.successData.identifier],
     {relativeTo: component.activatedRoute});
    }));
});


