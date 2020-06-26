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
import { of as observableOf, of } from 'rxjs';
import { CacheService } from 'ng2-cache-service';
import { TelemetryService } from '@sunbird/telemetry';
import { GroupsService } from '../../services';
import { APP_BASE_HREF } from '@angular/common';

describe('CreateEditGroupComponent', () => {
  let component: CreateEditGroupComponent;
  let fixture: ComponentFixture<CreateEditGroupComponent>;

  const resourceBundle = {
    'messages': {
      'emsg': {'m0005': ''}
    },
    frmelmnts: {
      lbl: {
        createGroup: 'create group'
      }
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditGroupComponent ],
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterTestingModule, SuiModule],
      providers: [CacheService, { provide: ResourceService, useValue: resourceBundle }, { provide: Router }, UserService,
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
  });
});
