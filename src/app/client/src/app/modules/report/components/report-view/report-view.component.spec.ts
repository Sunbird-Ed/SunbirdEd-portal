import { async, ComponentFixture, flush, TestBed } from '@angular/core/testing';
import { ReportViewComponent } from './report-view.component';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { DhitiService, CoreModule } from '@sunbird/core';
import { LOCALE_ID } from '@angular/core';
import {
  ConfigService,
  LayoutService,
  INoResultMessage,
  ResourceService,
  SharedModule,
} from '@sunbird/shared';
import * as _ from 'lodash-es';
import { SuiModule, SuiSelectModule, SuiModalModule } from 'ng2-semantic-ui-v9';
import { DashletModule } from '@project-sunbird/sb-dashlet-v9';
import { SlReportsLibraryModule } from '@shikshalokam/sl-reports-library';
import { of,throwError as observableThrowError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  reportData,
  reportSectionData,
  filterData,
  CriteriaData,
  downloadData
} from './report-view.component.spec.data';
import { AllEvidenceComponent } from '../all-evidence/all-evidence.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('ReportViewComponent', () => {
  let component: ReportViewComponent;
  let fixture: ComponentFixture<ReportViewComponent>;
  let dhitiService, location;
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        question: 'Questions',
        criteria: 'Criteria',
      },
      btn: {
        exportAs: 'ExportAs',
      },
    },
    messages: {
      fmsg: {
        m0088: 'Please wait'
      },
    },
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        SharedModule.forRoot(),
        SuiModule,
        SuiSelectModule,
        SuiModalModule,
        DashletModule.forRoot(),
        SlReportsLibraryModule,
        TranslateModule,
        HttpClientTestingModule,
      ],
      providers: [
        ConfigService,
        DatePipe,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: ChangeDetectorRef, useValue: {} },
        { provide: LOCALE_ID, useValue: 'en-US' },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              entityId: '5fd098e2e049735a86b748b8',
              observationId: '60587848129c8857da854d9e',
              entityType: 'district',
              solutionId: '6054abd9823d601f0af5c3a0',
              filter: {
                questionId: [],
              },
              criteriaWise: false,
              scores: 'false',
              observation: 'true',
            }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ReportViewComponent, AllEvidenceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportViewComponent);
    dhitiService = TestBed.get(DhitiService);
    location = TestBed.get(Location);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call ngoninit', () => {
    expect(component).toBeTruthy();
    spyOn(dhitiService, 'post').and.returnValue(of(reportData));
    spyOn(component, 'getReport').and.callThrough();
    spyOn(component, 'filterBySegment').and.callThrough();
    component.ngOnInit();
    expect(component.getReport).toHaveBeenCalled();
    expect(component.reportSections.length).toBeGreaterThan(0);
  });

  it('should call ngoninit on error ', () => {
    spyOn(dhitiService, 'post').and.returnValue(observableThrowError('error'));
    spyOn(component, 'getReport').and.callThrough();
    spyOn(component, 'filterBySegment').and.callThrough();
    component.ngOnInit();
    expect(component.getReport).toHaveBeenCalled();
  });

  it('Should navigate to  back to gotoSolutionListPage', () => {
    component.gotoSolutionListPage();
  });

  it('should call getData', () => {
    spyOn(component, 'getData').and.callThrough();
    component.getData(reportSectionData[0].questionArray[3]);
    expect(component.getData).toHaveBeenCalled();
  });

  it('should call getconfig', () => {
    spyOn(component, 'getconfig').and.callThrough();
    component.getconfig(reportSectionData[0].questionArray[3]);
    expect(component.getconfig).toHaveBeenCalled();
  });

  it('should call handleParameterChange', () => {
    const event = {
      _id: '6059cb813753e011940bee2b',
      name: 'Observation 1',
    };
    spyOn(dhitiService, 'post').and.returnValue(of(reportData));
    spyOn(component, 'getReport').and.callThrough();
    spyOn(component, 'filterBySegment').and.callThrough();
    spyOn(component, 'handleParameterChange').and.callThrough();
    component.handleParameterChange(event);
    expect(component.handleParameterChange).toHaveBeenCalled();
  });

  it('should call segmentChanged', () => {
    const segment = 'Criteria';
    spyOn(component, 'segmentChanged').and.callThrough();
    component.segmentChanged(segment);
    spyOn(dhitiService, 'post').and.returnValue(of(CriteriaData));
    spyOn(component, 'getReport').and.callThrough();
    spyOn(component, 'filterBySegment').and.callThrough();
    expect(component.segmentChanged).toHaveBeenCalled();
  });

  it('should call segmentChanged', () => {
    const segment = 'Questions';
    spyOn(component, 'segmentChanged').and.callThrough();
    component.segmentChanged(segment);
    spyOn(dhitiService, 'post').and.returnValue(of(reportData));
    spyOn(component, 'getReport').and.callThrough();
    spyOn(component, 'filterBySegment').and.callThrough();
    expect(component.segmentChanged).toHaveBeenCalled();
  });

  it('should call openFile', () => {
    const file = {
      url: 'https://samikshaprod.blob.core.windows.net/samiksha/6064c4bbb6bd37361305ddd9/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_IMG-20210329-WA00042204198365642023404.jpg?sv=2020-06-12&st=2021-07-04T05%3A55%3A29Z&se=2022-07-04T06%3A05%3A29Z&sr=b&sp=rw&sig=j3ncE3aazopRGhk4IbKzECmGvBxZ7%2BLwVx%2FfARjcquc%3D',
      extension: 'jpg',
    };
    spyOn(component, 'openFile').and.callThrough();
    component.openFile(file);
    expect(component.openFile).toHaveBeenCalled();
  });

  it('should call filterModalPopup', () => {
    spyOn(component, 'filterModalPopup').and.callThrough();
    component.filterModalPopup(
      filterData[2].filter.data,
      filterData[2].filter.keyToSend
    );
    component.filteredData = [
      'Q3_1616157220157-1616161753202',
      'Q4_1616157220157-1616161753203',
    ];
    expect(component.filterModalPopup).toHaveBeenCalled();
    expect(component.filterModal).toBe(true);
    expect(component.modalFilterData.length).toBeGreaterThan(0);
    expect(component.selectedListCount).toBeGreaterThan(0);
    expect(component.filteredData.length).toBeGreaterThan(0);
  });

  it('should call closeModal', () => {
    spyOn(component, 'closeModal').and.callThrough();
    component.modal = {
      approve: () => {},
    };
    component.closeModal();
    expect(component.filterModal).toBe(false);
  });

  it('should call onQuestionClick id included', () => {
    spyOn(component, 'onQuestionClick').and.callThrough();
    component.filteredData = [
      'Q3_1616157220157-1616161753202',
      'Q4_1616157220157-1616161753203',
    ];
    component.onQuestionClick('Q5_1616157220157-1616161753205');
    expect(component.onQuestionClick).toHaveBeenCalled();
    expect(component.filteredData.length).toBeGreaterThan(0);
  });

  it('should call onQuestionClick id not included', () => {
    spyOn(component, 'onQuestionClick').and.callThrough();
    component.filteredData = [
      'Q3_1616157220157-1616161753202',
      'Q4_1616157220157-1616161753203',
    ];
    component.onQuestionClick('Q3_1616157220157-1616161753202');
    expect(component.onQuestionClick).toHaveBeenCalled();
    expect(component.filteredData.length).toBeGreaterThan(0);
  });

  it('should call applyFilter for criteria', () => {
    component.filteredData = ['606c0ad32396373802fb57f3'];
    spyOn(component, 'applyFilter').and.callThrough();
    spyOn(dhitiService, 'post').and.returnValue(of(reportData));
    spyOn(component, 'getReport').and.callThrough();
    spyOn(component, 'filterBySegment').and.callThrough();
    component.segmentValue = 'Criteria';
    component.applyFilter();
    expect(component.applyFilter).toHaveBeenCalled();
    expect(component.reportSections.length).toBeGreaterThan(0);
    expect(component.filterModal).toBe(false);
  });

  it('should call applyFilter for questions', () => {
    component.filteredData = ['606c0ad32396373802fb57f3'];
    spyOn(component, 'applyFilter').and.callThrough();
    spyOn(dhitiService, 'post').and.returnValue(of(reportData));
    spyOn(component, 'getReport').and.callThrough();
    spyOn(component, 'filterBySegment').and.callThrough();
    component.segmentValue = 'Questions';
    component.applyFilter();
    expect(component.applyFilter).toHaveBeenCalled();
    expect(component.reportSections.length).toBeGreaterThan(0);
    expect(component.filterModal).toBe(false);
  });

  it('should call download if there is pdf', () => {
    spyOn(dhitiService, 'post').and.returnValue(of(downloadData));
    spyOn(component, 'download').and.callThrough();
    component.download();
    expect(component.download).toHaveBeenCalled();
  });

  it('should call download if there is no pdf', () => {
    downloadData.pdfUrl = null;
    downloadData.status = 'failed';
    spyOn(dhitiService, 'post').and.returnValue(of(downloadData));
    spyOn(component, 'download').and.callThrough();
    component.download();
    expect(component.download).toHaveBeenCalled();
  });

  it('should call getAllEvidence', () => {
    spyOn(component, 'getAllEvidence').and.callThrough();
    component.getAllEvidence(reportSectionData[0].questionArray[2]);
    expect(component.getAllEvidence).toHaveBeenCalled();
  });

  it('should call modalClose', () => {
    spyOn(component, 'modalClose').and.callThrough();
    const event = {};
    component.modalClose(event);
    expect(component.modalClose).toHaveBeenCalled();
  });
});
