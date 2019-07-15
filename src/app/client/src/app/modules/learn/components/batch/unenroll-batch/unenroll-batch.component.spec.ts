import { CourseBatchService } from '../../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardModule } from '../../../../dashboard/dashboard.module';
import { RouterTestingModule } from '@angular/router/testing';
import { LearnModule } from '@sunbird/learn';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UnEnrollBatchComponent } from './unenroll-batch.component';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {fakeBatchDetails} from './unenroll-batch.component.spec.data';
describe('UnEnrollBatchComponent', () => {
  let component: UnEnrollBatchComponent;
  let fixture: ComponentFixture<UnEnrollBatchComponent>;
  const fakeActivatedRoute = {
    'params': of({ 'batchId': '01271493706664345631' }),
    snapshot: {
      params: [
        {
          pageNumber: '1',
        }
      ],
      data: {
        telemetry: {
          env: 'workspace', pageid: 'workspace-course-batch', subtype: 'scroll', type: 'list',
          object: { type: 'batch', ver: '1.0' }
        }
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule.forRoot(), TelemetryModule.forRoot(), CoreModule, SuiModule, LearnModule, RouterTestingModule,
        DashboardModule, HttpClientTestingModule],
      providers: [{
        provide: ActivatedRoute, useValue: fakeActivatedRoute
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnEnrollBatchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch batch details with batch Id', () => {
    let courseBatchService = TestBed.get(CourseBatchService);
    let spy = spyOn(courseBatchService,'getEnrollToBatchDetails').and.returnValue(of(fakeBatchDetails));
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('01271493706664345631');
    expect(component.batchDetails).toEqual(fakeBatchDetails);
    // expect(component.fetchParticipantsDetails).toHaveBeenCalled();
  })

  it('should redirect whenever batchType is open', () => {

  })

  it('should redirect when error occurs while fetching batch details', () => {

  })

  it('')


});
