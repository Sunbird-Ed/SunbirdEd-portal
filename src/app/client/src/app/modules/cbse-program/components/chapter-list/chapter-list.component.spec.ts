import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Component, Input} from '@angular/core';
import * as _ from 'lodash-es';
import { ChapterListComponent } from './chapter-list.component';
import { RecursiveTreeComponent } from '../recursive-tree/recursive-tree.component';
import { ResourceTemplateComponent } from '../resource-template/resource-template.component';
import { TelemetryModule } from '@sunbird/telemetry';
import {
  ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService
} from '@sunbird/shared';
import { CoreModule, ActionService, UserService, PublicDataService } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf, throwError as observableError, of, Subscription } from 'rxjs';
import { SuiModule, SuiTabsModule, SuiSelect } from 'ng2-semantic-ui/dist';
import { ProgramStageService } from '../../../program/services';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';

import {
  chapterListComponentInput, role, sessionContext, responseSample,
  fetchedQueCount, chapterlistSample, textbookMeta, routerQuestionCategorySample, templateSelectionEvent
} from './chapter-list.component.spec.data';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DynamicModule } from 'ng-dynamic-component';
import { ContentUploaderComponent } from '../../components/content-uploader/content-uploader.component';


describe('ChapterListComponent', () => {
  let component: ChapterListComponent;
  let fixture: ComponentFixture<ChapterListComponent>;
  let errorInitiate, de: DebugElement;
  const actionServiceStub = {
    get() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf(responseSample);
      }
    },
    post() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf({result: {identifier: 'do_123', node_id: 'do_1234', versionKey: '123456'}});
      }
    },
    patch() {
      return observableOf('success');
    }
  };

  const activatedRouteStub = {
    data: of({
      config: {
        question_categories: [
          'vsa',
          'sa',
          'la',
          'mcq'
        ]
      }
    }),
    snapshot: {
      root: { firstChild: { data: { telemetry: { env: 'env' } } } },
      data: {
        telemetry: { env: 'env' }
      }
    }
  };

  const UserServiceStub = {
    userid: '874ed8a5-782e-4f6c-8f36-e0288455901e',
    userProfile: {
      firstName: 'Creator',
      lastName: 'ekstep'
    }
  };
  const PublicDataServiceStub = {
    post() {
      return observableOf(fetchedQueCount);
    }
  };
  const compState = 'chapterListComponent';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, RouterTestingModule, TelemetryModule.forRoot(), SuiModule,
        SuiTabsModule, FormsModule, DynamicModule],
      declarations: [ChapterListComponent, RecursiveTreeComponent, ResourceTemplateComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [CollectionHierarchyService,
             { provide: ActionService, useValue: actionServiceStub }, { provide: UserService, useValue: UserServiceStub },
      { provide: PublicDataService, useValue: PublicDataServiceStub }, ToasterService,
      { provide: ActivatedRoute, useValue: activatedRouteStub}, ProgramStageService]
    })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.chapterListComponentInput = chapterListComponentInput;
    errorInitiate = false;
    fixture.detectChanges();
  });


    it('Component created', () => {
      expect(component).toBeDefined();
    });

    it('stageSubscription should get subcribe on component initialize', () => {
      expect(component.stageSubscription).toBeDefined();
    });

    it('Default it should show all Chapters', () => {
      expect(component.selectedChapterOption).toMatch('all');
    });

    it('dynamicOuts should be registered on initialize', () => {
      expect(_.get(component.dynamicOutputs, 'uploadedContentMeta')).toBeDefined();
    });

    it('should call updateAccordianView on componet initialize', () => {
      spyOn(component, 'updateAccordianView');
      component.ngOnInit();
      expect(component.updateAccordianView).toHaveBeenCalled();
    });

    it('uploadHandler should be in uploadedContentMeta function', () => {
      spyOn(component, 'uploadHandler');
      component.dynamicOutputs.uploadedContentMeta({contentId: 'do_1234567'});
      expect(component.uploadHandler).toHaveBeenCalledWith({contentId: 'do_1234567'});
    });

    it('should call changeView on stage change', () => {
       // const programStageSpy = jasmine.createSpyObj('programStageService', ['getStage']);
       // programStageSpy.getStage.and.returnValue('stubValue');
       component.programStageService.getStage = jasmine.createSpy('getstage() spy').and.callFake(() => {
           return observableOf({stages: []});
       });
       spyOn(component, 'changeView');
       component.ngOnInit();
       expect(component.changeView).toHaveBeenCalled();
    });

    it('should call getHierarchy with second parameter as undefined', () => {
      spyOn(component, 'getCollectionHierarchy');
      component.updateAccordianView();
      expect(component.getCollectionHierarchy).toHaveBeenCalledWith(jasmine.any(String), undefined);
    });

    it('should emit output on execution of emitQuestionTypeTopic', () => {
      let mockData;
      component.selectedQuestionTypeTopic.subscribe((outputData) => {
          mockData = outputData;
      });
      component.emitQuestionTypeTopic('mcq', 'topic', 'do_123', 'do_1234', 'dummyResource');
      expect(mockData).toEqual(jasmine.objectContaining({questionType: 'mcq'}));
    });

    it('should have mandatory input objects to other dynamic components', () => {
      component.initiateInputs();
      // All assertions are related to single feature
      expect(_.has(component.dynamicInputs, 'contentUploadComponentInput.config')).toBeTruthy();
      expect(_.has(component.dynamicInputs, 'contentUploadComponentInput.sessionContext')).toBeTruthy();
      expect(_.has(component.dynamicInputs, 'contentUploadComponentInput.unitIdentifier')).toBeTruthy();
      expect(_.has(component.dynamicInputs, 'contentUploadComponentInput.templateDetails')).toBeTruthy();
      expect(_.has(component.dynamicInputs, 'contentUploadComponentInput.selectedSharedContext')).toBeTruthy();
      expect(_.has(component.dynamicInputs, 'contentUploadComponentInput.contentId')).toBeTruthy();
      expect(_.has(component.dynamicInputs, 'contentUploadComponentInput.action')).toBeTruthy();
      expect(_.has(component.dynamicInputs, 'contentUploadComponentInput.programContext')).toBeTruthy();
      expect(_.has(component.dynamicInputs, 'practiceQuestionSetComponentInput.sessionContext')).toBeTruthy();
      expect(_.has(component.dynamicInputs, 'practiceQuestionSetComponentInput.templateDetails')).toBeTruthy();
    });

    it('should call updateAccordianView only if current stage is chapterlist', () => {
      component.unitIdentifier = 'do_1234567890';
      component.state = { stages: [{stage: 'collectionComponent'}, {stage: 'chapterListComponent'}]};
      spyOn(component, 'updateAccordianView');
      component.changeView();
      expect(component.updateAccordianView).toHaveBeenCalledWith(jasmine.any(String));
    });

    it('on selecting unit in drop-down of chapterlist', () => {
      spyOn(component, 'updateAccordianView');
      component.onSelectChapterChange();
      expect(component.updateAccordianView).toHaveBeenCalledWith(undefined, jasmine.any(Boolean));
    });

    it('shoild close template selection-popup on successful selection', () => {
      component.handleTemplateSelection({});
      expect(component.showResourceTemplatePopup).toBeFalsy();
    });

    it('templateDetails should be defined on successful template selection', () => {
      component.selectedSharedContext = {framework: 'NCFCOPY', topic: ['Topic 2 child']};
      component.handleTemplateSelection(templateSelectionEvent);
      expect(component.templateDetails).toBeDefined();
    });

    it('templateDetails should be defined on successful template selection', () => {
      // tslint:disable-next-line:prefer-const
      let stubComponent: ContentUploaderComponent;
      component.selectedSharedContext = {framework: 'NCFCOPY', topic: ['Topic 2 child']};
      spyOn(component, 'componentLoadHandler');
      component.handleTemplateSelection(templateSelectionEvent);
      expect(component.componentLoadHandler).toHaveBeenCalledWith('creation', jasmine.any(Function), 'uploadComponent');
    });

    it('should add selected component to stage', () => {
      component.programStageService.addStage = jasmine.createSpy('addStage() spy').and.callFake(() => {
        return observableOf({stages: []});
       });
      // tslint:disable-next-line:prefer-const
      let stubComponent: ContentUploaderComponent;
      component.selectedSharedContext = {framework: 'NCFCOPY', topic: ['Topic 2 child']};
      // spyOn(component.programStageService, 'addStage');
      component.handleTemplateSelection(templateSelectionEvent);
      expect(component.programStageService.addStage).toHaveBeenCalled();
    });

    // it('should go to else condition if child unit is passed', () => {
    //   console.log(component.collectionHierarchy);
    //   component.updateAccordianView('do_112931801879011328152');
    //   expect(component.sessionContext.lastOpenedUnitParent).toEqual('do_1127639059664568321138');
    // });

});
