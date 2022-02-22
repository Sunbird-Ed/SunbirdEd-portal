import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryService, TelemetryModule } from '@sunbird/telemetry';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { ExploreFtuPopupComponent } from './explore-ftu-popup.component';
import { configureTestSuite } from '@sunbird/test-util';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('ExploreFtuPopupComponent', () => {
  let component: ExploreFtuPopupComponent;
  let fixture: ComponentFixture<ExploreFtuPopupComponent>;
  configureTestSuite();
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        groupWelcomeTitle: 'Welcome to groups',
      },
    }
  };
  const fakeActivatedRoute = {
    'params': of ({}),
    snapshot: {
        data: {
            telemetry: {
                env: 'groups', pageid: 'gropus-list', type: 'view', object: { type: 'groups', ver: '1.0' }
            }
        }
    }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreFtuPopupComponent ],
      imports: [HttpClientModule, SharedModule.forRoot(), TelemetryModule, RouterTestingModule],
      providers: [ { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        TelemetryService,
      ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(ExploreFtuPopupComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
    spyOn(component['close'], 'emit');
    component.userVisited();
    expect(component['close'].emit).toHaveBeenCalled();
  }));

  it('should call interact() ', () => {
    spyOn(component['telemetryService'], 'interact');
    component.addTelemetry('ftu-close');
    expect(component['telemetryService'].interact).toHaveBeenCalled();
  });
});
