import { async, ComponentFixture, TestBed} from '@angular/core/testing';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProgramHeaderComponent } from './program-header.component';
import { ProgramStageService, ProgramTelemetryService } from '../../services';
import { ToasterService, ConfigService } from '@sunbird/shared';
import { mockRes } from './program-header.component.spec.data';
import { configureTestSuite } from '@sunbird/test-util';
import * as _ from 'lodash-es';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';

const fakeActivatedRoute = {
  snapshot: {
    params: {
      programId: '6835f250-1fe1-11ea-93ea-2dffbaedca40'
    },
    data: {
      telemetry: {
        env: 'programs'
      }
    }
  }
};
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

const testStage = {stageId: 1, stage: 'collectionComponent'};


describe('ProgramHeaderComponent', () => {
  let component: ProgramHeaderComponent;
  let fixture: ComponentFixture<ProgramHeaderComponent>;
  let programStageService;
  let configService;
  let telemetryService;
  let de;

  const programTelemetryServiceStub = {

    getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: string): IInteractEventEdata {
      return _.omitBy({
        id,
        type,
        pageid,
        extra
      }, _.isUndefined);
    },
    getTelemetryInteractPdata(id?: string, pid?: string) {
      const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
      const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
      return {
        id,
        ver: version,
        pid
      };
    },
    getTelemetryInteractObject(id: string, type: string, ver: string): IInteractEventObject {
      return {
        id, type, ver
      };
    },
    getTelemetryInteractCdata(id: string, type: string) {
      return [{
        type, id
      }];
    }
  };
  // let serviceSpy: jasmine.SpyObj<ProgramStageService>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TelemetryModule, HttpClientTestingModule, CoreModule],
      declarations: [ ProgramHeaderComponent ],
      providers: [ ProgramStageService, ToasterService, TelemetryService, ConfigService,
        { provide: ProgramTelemetryService, useValue: programTelemetryServiceStub},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(ProgramHeaderComponent);
    de = fixture.debugElement;
    programStageService = TestBed.get(ProgramStageService);
    configService = TestBed.get(ConfigService);
    telemetryService = TestBed.get(TelemetryService);
    component = fixture.componentInstance;
    component.headerComponentInput = mockRes.inputData;
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));


  it('should generate tabs based on config', () => {
    const spyOne = spyOn(component, 'generateTabs').and.callThrough();
    component.ngOnInit();
    // programStageService.getStage();
    fixture.detectChanges();
    expect(spyOne).toHaveBeenCalled();
    expect(component.tabs).toEqual(mockRes.inputData.header.config.tabs);
    expect(component.state.stages.length).toEqual(0);
  });


  it('should have empty stage', () => {
    const EXPECTED_NUMBER_OF_ITEMS = 0;
    expect(component.state.stages.length).toBe(EXPECTED_NUMBER_OF_ITEMS);
  });


  it('should have initial stage', () => {
    component.ngOnInit();
    programStageService.getStage().subscribe(state => {
      fixture.detectChanges();
      expect(state.stages).toEqual([testStage]);
    });

    // expect(component.headerActions.showTabs).toBe(false);
    programStageService.addStage('collectionComponent');
  });

  it('should execute ngOnChanges lifecycle', () => {
    const spyOne = spyOn(component, 'generateTabs').and.callThrough();
    component.headerComponentInput = mockRes.inputData;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(spyOne).toHaveBeenCalled();
  });

  it('should call handleTabChange on  ', () => {
    const spy = spyOn(component, 'handleTabChange').and.callThrough();

    const button = fixture.debugElement.nativeElement.querySelector('.practical-appbar__item');
    button.click();

    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should call handleBack on button click ', () => {
    component.headerActions.showTabs = false;
    fixture.detectChanges();
    const spy = spyOn(component, 'handleBack').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should make showTabs false', () => {
    // component.ngOnInit();
    component.state.stages.length = 2;
    component.handleTabs();
    expect(component.headerActions.showTabs).toEqual(false);

  });
});
