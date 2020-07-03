import { FormBuilder, Validators } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditGroupComponent } from './create-edit-group.component';
import { SharedModule, ResourceService } from '@sunbird/shared';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as _ from 'lodash-es';
import { CoreModule, UserService} from '@sunbird/core';
import { of, throwError } from 'rxjs';
import { CacheService } from 'ng2-cache-service';
import { TelemetryService } from '@sunbird/telemetry';
import { GroupsService } from '../../services';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from '@sunbird/test-util';

describe('CreateEditGroupComponent', () => {
  let component: CreateEditGroupComponent;
  let fixture: ComponentFixture<CreateEditGroupComponent>;
  configureTestSuite();
  const formBuilder: FormBuilder = new FormBuilder();
  const resourceBundle = {
    'messages': {
      'emsg': {'m0005': '', m001: ''},
      smsg: {m001: ''}
    },
    frmelmnts: {
      lbl: {
        createGroup: 'create group'
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = 'browse';
  }
  const fakeActivatedRoute = {
    'params': of({}),
    snapshot: {
      data: {
          telemetry: {
            env: 'groups', pageid: 'group-create', type: 'view', object: { type: 'groups', ver: '1.0' }
          }
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditGroupComponent ],
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterTestingModule, SuiModule],
      providers: [CacheService, { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub }, UserService,
        TelemetryService, { provide: ActivatedRoute, useValue: fakeActivatedRoute }, GroupsService,
        {provide: APP_BASE_HREF, useValue: '/'} ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn<any>(component, 'initializeForm');
    component.ngOnInit();
    expect(component['initializeForm']).toHaveBeenCalled();
  });

  it('should initialize form', () => {
    component['initializeForm']();
    expect(component.groupForm.get('name').valid).toBeFalsy();
    expect(component.groupForm.get('description').valid).toBeTruthy();
    expect(component.groupForm.get('groupToc').valid).toBeFalsy();
  });

  it('should call closeModal on group creation', () => {
    component.groupForm = formBuilder.group({
      name: ['ABCD'],
      description: [''],
      groupToc: [true]
    });
    spyOn(component.submitForm, 'emit');
    spyOn(component.groupService, 'createGroup').and.returnValue(of ({identifier: '1234', name: 'ABCD'}));
    spyOn(component['toasterService'], 'success');
    component.onSubmitForm();
    component.groupService.createGroup(component.groupForm.value).subscribe(group => {
      expect(component.submitForm.emit).toHaveBeenCalledWith(group);
      expect(component['toasterService'].success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m001);
    });
  });

  it('should throw error on group creation', () => {
    component.groupForm = formBuilder.group({
      name: ['ABCD'],
      description: [''],
      groupToc: [true]
    });
    spyOn(component.submitForm, 'emit');
    spyOn(component.groupService, 'createGroup').and.returnValue(throwError ({err: ''}));
    spyOn(component['toasterService'], 'error');
    spyOn(component, 'closeModal');
    component.onSubmitForm();
    component.groupService.createGroup(component.groupForm.value).subscribe(group => {}, (err) => {
      expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m001);
      expect(component.closeModal).toHaveBeenCalled();
    });
  });
});
