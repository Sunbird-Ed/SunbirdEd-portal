import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddActivityContentTypesComponent } from './add-activity-content-types.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule, ResourceService, ConfigService, BrowserCacheTtlService, NavigationHelperService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { TelemetryService } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';


describe('AddActivityContentTypesComponent', () => {
  let component: AddActivityContentTypesComponent;
  let fixture: ComponentFixture<AddActivityContentTypesComponent>;

  class RouterStub {
    public url = '/add-activity-to-group';
  }

  const fakeActivatedRoute = {
    snapshot: {
      data: {
        telemetry: {
          env: 'groups',
          pageid: 'add-activity-to-group',
          type: 'view',
          subtype: 'paginate',
          ver: '1.0'
        }
      }
    },
    queryParams: of({
      groupName: 'my group',
      createdBy: 'sudip',
      groupId: '7899456dfghj56578'
    })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot()],
      declarations: [AddActivityContentTypesComponent],
      providers: [
        TelemetryService,
        ResourceService,
        ConfigService,
        BrowserCacheTtlService,
        NavigationHelperService,
        { provide: Router, useClass: RouterStub},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: APP_BASE_HREF, useValue: '/' }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityContentTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
