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
import { GroupsService, fakeActivatedRouteWithGroupId } from '../../services';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from '@sunbird/test-util';
import { GroupEntityStatus } from '@project-sunbird/client-services/models/group';

describe('CreateEditGroupComponent', () => {
  let component: CreateEditGroupComponent;
  let fixture: ComponentFixture<CreateEditGroupComponent>;
  configureTestSuite();
  const formBuilder: FormBuilder = new FormBuilder();
  const resourceBundle = {
    'messages': {
      groups: {
        emsg: {
          m001: 'You have exceeded the maximum number of groups that can be created',
        },
      },
      'emsg': {m005: '', m001: '', },
      smsg: {m001: '', m003: '', grpcreatesuccess: 'Group created successfully'}
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditGroupComponent ],
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterTestingModule, SuiModule],
      providers: [CacheService, { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub }, UserService,
        TelemetryService, { provide: ActivatedRoute, useValue: fakeActivatedRouteWithGroupId }, GroupsService,
        {provide: APP_BASE_HREF, useValue: '/'} ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.groupForm = formBuilder.group({
      name: ['ABCD'],
      description: [''],
      groupToc: [true]
    });
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
    spyOn(component.groupService, 'createGroup').and.returnValue(of ({identifier: '1234', name: 'ABCD'}));
    spyOn(component['toasterService'], 'success');
    component.onSubmitForm();
    component.groupService.createGroup(component.groupForm.value).subscribe(group => {
      expect(component['toasterService'].success).toHaveBeenCalledWith(resourceBundle.messages.smsg.grpcreatesuccess);
    });
  });

  it('should throw error on group creation', () => {
    component.groupForm = formBuilder.group({
      name: ['ABCD'],
      description: [''],
      groupToc: [true]
    });
    spyOn(component.groupService, 'createGroup').and.returnValue(throwError ({err: ''}));
    spyOn(component['toasterService'], 'error');
    spyOn(component, 'closeModal');
    component.onSubmitForm();
    component.groupService.createGroup(component.groupForm.value).subscribe(group => {}, (err) => {
      expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m001);
      expect(component.closeModal).toHaveBeenCalled();
    });
  });

  it('should call closeModal on group updation', () => {
    expect(component.groupForm.value.name).toEqual('ABCD');
    component.groupForm = formBuilder.group({
      name: ['ACD'],
      description: [''],
      groupToc: [true]
    });
    spyOn(component.groupService, 'updateGroup').and.returnValue(of ({}));
    spyOn(component['toasterService'], 'success');
    component.updateGroup();
    component.groupService.updateGroup('123', {name: 'ACD', status: GroupEntityStatus.ACTIVE}).subscribe(group => {
      expect(component.groupForm.value.name).toEqual('ACD');
      expect(component['toasterService'].success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m001);
    });
  });

  it('should throw error on group updation', () => {
    expect(component.groupForm.value.name).toEqual('ABCD');
    component.groupForm = formBuilder.group({
      name: ['ACD'],
      description: [''],
      groupToc: [true]
    });
    spyOn(component.groupService, 'updateGroup').and.returnValue(throwError ({}));
    spyOn(component['toasterService'], 'error');
    component.updateGroup();
    component.groupService.updateGroup('123', {name: 'ACD', status: GroupEntityStatus.ACTIVE}).subscribe(group => {}, err => {
      expect(component.groupForm.value.name).not.toEqual('ACD');
      expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m005);
    });
  });

  it('should reset form', () => {
    spyOn(component.groupForm, 'reset');
    component.reset();
    expect(component.groupForm.reset).toHaveBeenCalled();
  });

  it('should call addTelemetry', () => {
    spyOn(component['groupService'], 'addTelemetry');
    component.groupId = '123';
    component.addTelemetry('ftu-popup', '', { } );
    // tslint:disable-next-line:max-line-length
    expect(component['groupService'].addTelemetry).toHaveBeenCalledWith({id: 'ftu-popup', extra: '', edata: { }  },
    fakeActivatedRouteWithGroupId.snapshot, [], '123');
  });

  it('should throw on EXCEEDED_GROUP_MAX_LIMIT', () => {
    const error = {
        response: {
          body: {
            'id': 'api.group.create',
            'params': {
              'resmsgid': null,
              'msgid': '50f1d17c-9e5b-4e1e-841e-3fc5ba34c84a',
              'err': 'GS_CRT04',
              'status': 'failed',
              'errmsg': 'Failed to create group, exceeded number of permissible groups of 50.'
            },
            'result': {},
            'responseCode': 400
          }
        }
    };
    spyOn(component.groupService, 'createGroup').and.returnValue(throwError (error));
    spyOn(component['toasterService'], 'error');
    component.onSubmitForm();
    component.groupService.createGroup(component.groupForm.value).subscribe(group => {
    }, err => {
      expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.groups.emsg.m001);
    });
  });
});
