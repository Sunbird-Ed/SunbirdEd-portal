import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatasetsComponent } from './datasets.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService,SharedModule } from '@sunbird/shared';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedFeatureModule } from '@sunbird/shared-feature';

describe('DatasetsComponent', () => {
  let component: DatasetsComponent;
  let fixture: ComponentFixture<DatasetsComponent>;

  const resourceServiceMockData = {

    frmelmnts: {
      btn: {
       ok:'ok',
        yes: 'yes',
        no: 'no'
        
      },
      lbl: {
        csvDataSets: 'CSV Datasets',
        programDatasets: 'Program Datasets',
        detailsReports: 'Details Reports',
        confirmReportRequest: 'Are you sure you want to request this report?'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TelemetryModule.forRoot(),
        SharedModule.forRoot(),
        SharedFeatureModule,
        SuiModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers:[
        { provide: ActivatedRoute, useValue: {
          snapshot: {
              params: {
                  reportId: '123'
              },
              data: {
                  telemetry: { env: 'dashboard', pageid: 'org-admin-dashboard', type: 'view' }
              }
          }
      } },
        { provide: ResourceService,useValue: resourceServiceMockData}
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ DatasetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProgramsList', () => {
    // expect(component).toBeTruthy();
    const spy = spyOn(component, 'getProgramsList').and.callThrough();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    

  });

});
