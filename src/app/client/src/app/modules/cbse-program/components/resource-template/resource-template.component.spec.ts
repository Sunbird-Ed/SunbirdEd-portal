import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {resourceTemplateComponentInput} from './resource-template.data';
import { ResourceTemplateComponent } from './resource-template.component';
import { SuiModule } from 'ng2-semantic-ui';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
    ResourceService, ToasterService, SharedModule, ConfigService,
    UtilService, BrowserCacheTtlService, NavigationHelperService
  } from '@sunbird/shared';
  import { Router, ActivatedRoute } from '@angular/router';
  import { CoreModule } from '@sunbird/core';
  import { configureTestSuite } from '@sunbird/test-util';
  const routerStub = {
    navigate: jasmine.createSpy('navigate')
  };
  const fakeActivatedRoute = {
    snapshot: {
      queryParams: {
        dialCode: 'D4R4K4'
      },
      data: {
        telemetry: { env: 'programs'}
      }
    }
  };

describe('ResourceTemplateComponent', () => {
  let component: ResourceTemplateComponent;
  let fixture: ComponentFixture<ResourceTemplateComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, TelemetryModule, CoreModule,  HttpClientTestingModule],
      declarations: [ ResourceTemplateComponent ],
      providers: [ConfigService, TelemetryService, { provide: Router, useValue: routerStub},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceTemplateComponent);
    component = fixture.componentInstance;
    component.resourceTemplateComponentInput = resourceTemplateComponentInput;
    component.unitIdentifier = 'do_0000000000';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showButton should be false on component initialize', () => {
    expect(component.showButton).toBeFalsy();
  });

  it('templateList should be defined', () => {
    expect(component.templateList).toBeDefined();
  });

  it('should emit event with type -next- on handleSubmit method execution', () => {
    component.templateSelected = 'explanationContent';
    fixture.detectChanges();
    spyOn(component.templateSelection, 'emit');
    component.handleSubmit();
    // tslint:disable-next-line:max-line-length
    expect(component.templateSelection.emit).toHaveBeenCalledWith({type: 'next', template: 'explanationContent', templateDetails: resourceTemplateComponentInput.templateList[0]});
  });

});
