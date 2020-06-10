import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultComponent } from './no-result.component';
import { Router } from '@angular/router';
import { SharedModule, ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { CacheService } from 'ng2-cache-service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { configureTestSuite } from '@sunbird/test-util';

describe('NoResultComponent', () => {
  let component: NoResultComponent;
  let fixture: ComponentFixture<NoResultComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, SharedModule.forRoot(), SuiModule, TelemetryModule.forRoot(), PlayerHelperModule],
      declarations: [NoResultComponent],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService, DeviceDetectorService,
        { provide: Router, useClass: RouterStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on click of explore', () => {
    spyOn(component.exploreMoreContent, 'emit');
    component.handleEvent();
    expect(component.exploreMoreContent.emit).toHaveBeenCalled();
  });
});
