import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { ExploreGroupComponent } from './explore-group.component';
import { configureTestSuite } from '@sunbird/test-util';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ExploreGroupComponent', () => {
  let component: ExploreGroupComponent;
  let fixture: ComponentFixture<ExploreGroupComponent>;
  configureTestSuite();
  const fakeActivatedRoute = {
    'params': of ({}),
    snapshot: {
        data: {
            telemetry: {
                env: 'groups', pageid: 'explore-group', type: 'view', subtype: 'paginate',
            }
        }
    }
  };
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        loginToCreateGroup: 'login'
      },
      btn: {
        login: 'login'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreGroupComponent ],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule, RouterTestingModule],
      providers: [ TelemetryService, { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    localStorage.setItem('anonymous_ftu_groups', 'anonymous');
    component.ngOnInit();
    expect(component.showWelcomePopup).toBeFalsy();
  });

  it('should make showWelcomePopup TRUE', () => {
    component.showFtuPopup(true);
    expect(component.showWelcomePopup).toBeTruthy();
  });

  it('should make showWelcomePopup FALSE ', () => {
    component.ngOnInit();
    expect(component.showWelcomePopup).toBeFalsy();
  });

  it('should call interact() ', () => {
    spyOn(component['telemetryService'], 'interact');
    component.addTelemetry('login-group');
    expect(component['telemetryService'].interact).toHaveBeenCalled();
  });

});
