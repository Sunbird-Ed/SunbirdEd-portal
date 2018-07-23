
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { ActivatedRoute, Router } from '@angular/router';
import { SuiModule } from 'ng2-semantic-ui';
import { EditorService } from './../../services';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { UserService, LearnerService, CoreModule } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { DefaultTemplateComponent } from './content-creation-default-template.component';
import { mockData } from './content-creation-default-template.component.spec.data';
import { expand } from 'rxjs/operators';

describe('DefaultTemplateComponent', () => {
  let component: DefaultTemplateComponent;
  let fixture: ComponentFixture<DefaultTemplateComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const resourceBundle =  {
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
    'url': observableOf({ 'path': 'textbook' })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, SuiModule, SharedModule.forRoot(), CoreModule.forRoot()],
      declarations: [ DefaultTemplateComponent ],
      providers: [UserService, LearnerService,
        CacheService, EditorService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        {provide: ResourceService, useValue: resourceBundle}],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.formFieldProperties = [];
    component.categoryMasterList = [];
    expect(component).toBeTruthy();
  });
  it('should call mapMasterCategoryList', () => {
    component.formFieldProperties = mockData.success;
    component.mapMasterCategoryList('');
    expect(component.categoryList).toBeDefined();
  });
   it('should call mapMasterCategoryList with key and return empty object ', () => {
    component.formFieldProperties = mockData.success;
    component.mapMasterCategoryList('key');
    expect(component.categoryList).toBeDefined();
    expect(component.categoryList).toEqual({});
  });
  it('should call applyDependencyRules', () => {
    const range = mockData.formFieldMetaData;
    const associations =  mockData.frameworkAssociations.associations;
    component.applyDependencyRules(range, associations, false);
    expect(component.updateDropDownList).toBeDefined();
  });
  it('should call getAssociations', () => {
    const key = undefined;
    const range = mockData.formFieldMetaData.range;
    const callback = jasmine.createSpy('callback');
    component.getAssociations(key, range, callback);
  });
  it('should emit user profile data oninit', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    component.ngOnInit();
    userService._userData$.next({ err: null, userProfile: mockData.userSuccess });
    expect(component.userProfile).toBeDefined();
  });
  it('should call ngAfterViewInit', () => {
    const DROPDOWN_INPUT_TYPES = ['select', 'multiSelect'];
    component.formFieldProperties = mockData.formFieldMetaData;
    component.setFormConfig();
  });
  it('should call onConfigChange', () => {
   const data = mockData.onConfigChangeData;
   spyOn(component, 'updateForm').and.callThrough();
   component.updateForm(data);
   expect(component.updateForm).toHaveBeenCalled();
  });
});
