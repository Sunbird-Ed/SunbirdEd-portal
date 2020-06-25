import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupFormComponent } from './group-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as _ from 'lodash-es';
import { CoreModule, UserService} from '@sunbird/core';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { of as observableOf, of } from 'rxjs';
import { groupFormMockData } from './group-form.component.spec.data';
import { CacheService } from 'ng2-cache-service';
import { DebugElement } from '@angular/core';
import { TelemetryService } from '@sunbird/telemetry';
import { GroupsService } from '../../services';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from '@sunbird/test-util';

describe('GroupFormComponent', () => {
  let component: GroupFormComponent;
  let fixture: ComponentFixture<GroupFormComponent>;
  let debugElement: DebugElement;

  const resourceBundle = {
    'messages': {
      'emsg': {'m0005': ''}
    }
  };
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
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterTestingModule],
      declarations: [GroupFormComponent],
      providers: [CacheService, { provide: ResourceService, useValue: resourceBundle }, { provide: Router }, UserService,
        TelemetryService, { provide: ActivatedRoute, useValue: fakeActivatedRoute }, GroupsService,
        {provide: APP_BASE_HREF, useValue: '/'} ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFormComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });
});
