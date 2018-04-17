import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataDrivenComponent } from './data-driven.component';
import { DefaultTemplateComponent } from '../content-creation-default-template/content-creation-default-template.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { ActivatedRoute, Router } from '@angular/router';
import { SuiModule } from 'ng2-semantic-ui';
import { EditorService } from './../../services';
import { ResourceService, ConfigService, ToasterService } from '@sunbird/shared';
import { FrameworkService, FormService, ContentService, UserService, LearnerService } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { Observable } from 'rxjs/Observable';
import { mockFrameworkData } from './data-driven.component.data.spec';

describe('DataDrivenComponent', () => {
  let componentParent: DataDrivenComponent;
  let fixtureParent: ComponentFixture<DataDrivenComponent>;
  let componentChild: DefaultTemplateComponent;
  let fixtureChild: ComponentFixture<DefaultTemplateComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const resourceBundle = {
    'messages': {
      'emsg': {
        'm0005': 'api failed, please try again'
      },
      'stmsg': {
        'm0018': 'We are fetching content...',
        'm0008': 'no-results',
        'm0033': 'You dont have any content'
      }
    }
  };
  const fakeActivatedRoute = {
    'url': Observable.of([{ 'path': 'textbook' }])
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, SuiModule],
      declarations: [DataDrivenComponent, DefaultTemplateComponent],
      providers: [FrameworkService, FormService, UserService, ConfigService, ToasterService, LearnerService, ContentService,
        CacheService, EditorService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixtureParent = TestBed.createComponent(DataDrivenComponent);
    componentParent = fixtureParent.componentInstance;
    fixtureChild = TestBed.createComponent(DefaultTemplateComponent);
    componentChild = fixtureChild.componentInstance;
    fixtureParent.detectChanges();
  });

  it('should create', () => {
    expect(componentParent).toBeTruthy();
  });
  it('should fetch framework details', () => {
    const service = TestBed.get(FrameworkService);
    const cacheService = TestBed.get(CacheService);
    const contentService = TestBed.get(ContentService);
    service._frameWorkData$ = mockFrameworkData.success;
    service._frameworkData$.next({
      err: null, framework: mockFrameworkData.success.framework,
      frameworkdata: mockFrameworkData.success.frameworkdata
    });
    componentParent.exists = true;
    componentParent.formFieldProperties = mockFrameworkData.formSuccess.fields;
    componentParent.getMetaData();
  });
  it('should throw error', () => {
    const service = TestBed.get(FrameworkService);
    const cacheService = TestBed.get(CacheService);
    const contentService = TestBed.get(ContentService);
    service._frameWorkData$ = mockFrameworkData.frameworkError;
    service._frameworkData$.next({
      err: mockFrameworkData.frameworkError.err,
      framework: mockFrameworkData.frameworkError.framework, frameworkdata: mockFrameworkData.frameworkError.frameworkdata
    });
    componentParent.formFieldProperties = mockFrameworkData.formSuccess.fields;
    componentParent.getMetaData();
  });
  it('should router to collection editer ', () => {
    const state = 'Draft';
    const type = 'TextBook';
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const editorService = TestBed.get(EditorService);
    componentChild.formInputData = { name: 'abcd', board: 'NCERT' };
    componentParent.formData = componentChild;
    componentParent.framework = 'NCERT';
    componentParent.contentType = 'textbook';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    spyOn(componentParent, 'createCollection').and.callThrough();
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.returnValue(Observable.of(mockFrameworkData.createCollectionData));
    componentParent.createCollection();
    expect(router.navigate).toHaveBeenCalledWith(
      ['/workspace/content/edit/collection', 'do_2124708548063559681134', 'TextBook', 'Draft', componentParent.framework]);
  });
  it('should not router to collection editer ', () => {
    const state = 'Draft';
    const type = 'TextBook';
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const editorService = TestBed.get(EditorService);
    componentChild.formInputData = { name: 'abcd', board: 'NCERT' };
    componentParent.formData = componentChild;
    componentParent.framework = 'NCERT';
    componentParent.contentType = 'studymaterial';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    spyOn(componentParent, 'createCollection').and.callThrough();
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.returnValue(Observable.of(mockFrameworkData.createCollectionData));
    componentParent.createCollection();
    expect(router.navigate).not.toHaveBeenCalledWith(
      ['/workspace/content/edit/collection', 'do_2124708548063559681134', 'TextBook', 'Draft', componentParent.framework]);
  });
  it('should router to contentEditor editer ', () => {
    const state = 'Draft';
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const editorService = TestBed.get(EditorService);
    componentChild.formInputData = { name: 'abcd', board: 'NCERT' };
    componentParent.formData = componentChild;
    componentParent.framework = 'NCERT';
    componentParent.contentType = 'studymaterial';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    spyOn(componentParent, 'createCollection').and.callThrough();
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.returnValue(Observable.of(mockFrameworkData.createCollectionData));
    componentParent.createCollection();
    expect(router.navigate).toHaveBeenCalledWith(
      ['/workspace/content/edit/contentEditor/', 'do_2124708548063559681134', 'Draft', componentParent.framework]);
  });
  it('should not router to contentEditor editer ', () => {
    const state = 'Draft';
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const editorService = TestBed.get(EditorService);
    componentChild.formInputData = { name: 'abcd', board: 'NCERT' };
    componentParent.formData = componentChild;
    componentParent.framework = 'NCERT';
    componentParent.contentType = 'textbook';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    spyOn(componentParent, 'createCollection').and.callThrough();
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.returnValue(Observable.of(mockFrameworkData.createCollectionData));
    componentParent.createCollection();
    expect(router.navigate).not.toHaveBeenCalledWith(
      ['/workspace/content/edit/contentEditor/', 'do_2124708548063559681134', 'Draft', componentParent.framework]);
  });
});
