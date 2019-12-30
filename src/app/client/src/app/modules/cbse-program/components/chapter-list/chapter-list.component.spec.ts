import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { SuiModule, SuiTabsModule } from 'ng2-semantic-ui/dist';
import { ProgramStageService } from '../../../program/services';

import {
  chapterListComponentInput, role, sessionContext, responseSample,
  fetchedQueCount, chapterlistSample, textbookMeta, routerQuestionCategorySample
} from './chapter-list.component.data';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DynamicModule } from 'ng-dynamic-component';


describe('ChapterListComponent', () => {
  let component: ChapterListComponent;
  let fixture: ComponentFixture<ChapterListComponent>;
  let stageSubscription: Subscription;
  let errorInitiate, de: DebugElement;
  let collection;
  const actionServiceStub = {
    get() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf(responseSample);
      }
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
    userid: '874ed8a5-782e-4f6c-8f36-e0288455901e'
  };
  const PublicDataServiceStub = {
    post() {
      return observableOf(fetchedQueCount);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, RouterTestingModule, TelemetryModule.forRoot(), SuiModule,
        SuiTabsModule, FormsModule, DynamicModule],
      declarations: [ChapterListComponent, RecursiveTreeComponent, ResourceTemplateComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: ActionService, useValue: actionServiceStub }, { provide: UserService, useValue: UserServiceStub },
      { provide: PublicDataService, useValue: PublicDataServiceStub }, ToasterService, ProgramStageService,
      {
        provide: ActivatedRoute, useValue: activatedRouteStub
      }]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.chapterListComponentInput = chapterListComponentInput;
    component.role = chapterListComponentInput.role;
    component.sessionContext = chapterListComponentInput.sessionContext;
    errorInitiate = false;
    component.programStageService = TestBed.get(ProgramStageService);
    stageSubscription = component.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
    });
    fixture.detectChanges();
  });



  it('should execute getCollectionHierarchy on initialization of component', () => {
    spyOn(component, 'getCollectionHierarchy').and.callThrough();
    component.ngOnInit();
    expect(component.getCollectionHierarchy).toHaveBeenCalledWith(component.sessionContext.collection, undefined);
    expect(component.collectionHierarchy).toBeTruthy();
  });


  it('should execute onSelectChapterChange on dropdown change', () => {

    spyOn(component, 'onSelectChapterChange').and.callThrough();

    collection = _.map(component.collectionHierarchy, _.property('identifier'));
    component.selectedChapterOption = collection[1];
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('sui-select'));
    fixture.whenStable().then(() => {
      select.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(component.showLoader).toBe(true);
      expect(component.onSelectChapterChange).toHaveBeenCalledWith(component.selectedChapterOption);
    });

  });

  it('show resource template with Add resource action', () => {
    const recursiveComponent = new RecursiveTreeComponent();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    // recursiveComponent.nodeMeta.emit({
    //   action: 'add',
    //   showPopup: true,
    //   collection: collection[1]
    // });
    spyOn(component, 'showResourceTemplate').and.callThrough();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.showResourceTemplate).toHaveBeenCalled();
    });
  });

  // it('show resource template with delete action', () => {
  //   const recursiveComponent = new RecursiveTreeComponent();
  //   recursiveComponent.nodeMeta.emit({
  //     action: 'delete',
  //     showPopup: null,
  //     content: collection[1],
  //     collection: component.collectionHierarchy
  //   });

  //   spyOn(component, 'removeResourceToHierarchy').and.callThrough();
  //   fixture.whenStable().then(() => {
  //     fixture.detectChanges();
  //     expect(component.removeResourceToHierarchy).toHaveBeenCalled();
  //   });
  // });




  // it('should call showChapterList on successfully collecting textBookMetaData', () => {
  //   component.sessionContext.currentRole = 'REVIEWER';
  //   fixture.detectChanges();
  //   spyOn(component, 'showChapterList');
  //   component.getCollectionHierarchy(sessionContext.textbook);
  //   expect(component.showChapterList).toHaveBeenCalled();
  // });

  // it('should call showChapterList with role  CONTRIBUTOR', () => {
  //   component.sessionContext.currentRole = 'CONTRIBUTOR';
  //   fixture.detectChanges();
  //   spyOn(component, 'showChapterList');
  //   component.getCollectionHierarchy(sessionContext.textbook);
  //   expect(component.showChapterList).toHaveBeenCalled();
  // });

  // it('should call showChapterList with role  PUBLISHER', () => {
  //   component.sessionContext.currentRole = 'PUBLISHER';
  //   fixture.detectChanges();
  //   spyOn(component, 'showChapterList');
  //   component.getCollectionHierarchy(sessionContext.textbook);
  //   expect(component.showChapterList).toHaveBeenCalled();
  // });

  // xit('should throw error Fetching TextBook details failed', () => {
  //   errorInitiate = true;
  //   spyOn(component.toasterService, 'error');
  //   component.getCollectionHierarchy(sessionContext.textbook);
  //   expect(component.toasterService.error).toHaveBeenCalledWith('Fetching TextBook details failed');
  // });

  // it('should emit click event on click of chapterlist row', () => {
  //   spyOn(component, 'emitQuestionTypeTopic');
  //   spyOn(component, 'getCollectionHierarchy');
  //   component.showLoader = false;
  //   component.showError = false;
  //   component.textBookChapters = chapterlistSample;
  //   component.routerQuestionCategory = routerQuestionCategorySample;
  //   component.ngOnInit();
  //   fixture.detectChanges();
  //   const tableRow = de.nativeElement.querySelectorAll('tr');
  //   tableRow[1].click();
  //   fixture.detectChanges();
  //   expect(component.emitQuestionTypeTopic).toHaveBeenCalled();
  // });

  // it('should execute ngOnChanges', () => {
  //   const changed = { selectedSchool: { currentValue: 'newOne', previousValue: 'oldOne' } };
  //   spyOn(component, 'ngOnChanges').and.callThrough();
  //   spyOn(component, 'showChapterList');
  //   component['textbookMeta'] = [{ test: 1 }];
  //   component.ngOnChanges(changed);
  //   expect(component.showChapterList).toHaveBeenCalled();
  //   expect(component.showChapterList).toHaveBeenCalledTimes(1);
  //   expect(component.sessionContext.selectedSchoolForReview).toEqual('newOne');
  // });

  // it('should execute ngOnChanges without break if selectedSchool is not changed', () => {
  //   const changed = {};
  //   spyOn(component, 'ngOnChanges').and.callThrough();
  //   spyOn(component, 'showChapterList');
  //   component.getCollectionHierarchy(sessionContext.textbook);
  //   component.ngOnChanges(changed);
  //   expect(component.showChapterList).toHaveBeenCalled();
  // });

  // it('should throw error on failure of apiRequest', () => {
  //   component.sessionContext.currentRole = 'unknown';
  //   fixture.detectChanges();
  //   spyOn(component.toasterService, 'error');
  //   component.showChapterList(textbookMeta);
  //   expect(component.toasterService.error).toHaveBeenCalledWith('You don\'t have permission to access this page');
  // });

  it('unsubscribes when destroyed', () => {
    component.ngOnDestroy();
    const spy = spyOn(stageSubscription, 'unsubscribe').and.callFake(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });
});
