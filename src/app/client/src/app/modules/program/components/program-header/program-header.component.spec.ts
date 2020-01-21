import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { TelemetryModule, TelemetryInteractDirective } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProgramHeaderComponent } from './program-header.component';
import { ProgramStageService } from '../../services';
import { SharedModule, ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { mockRes } from './program-header.component.spec.data';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
const fakeState = {
  getStage() {
    of([{ stageId: 1, stage: 'collectionComponent' }]);
  },
};
const testStage = {stageId: 1, stage: 'collectionComponent'};
describe('ProgramHeaderComponent', () => {
  let component: ProgramHeaderComponent;
  let fixture: ComponentFixture<ProgramHeaderComponent>;
  let programStageService;
  let de;
  // let serviceSpy: jasmine.SpyObj<ProgramStageService>;
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
  beforeAll(() => {
    programStageService = TestBed.get(ProgramStageService);
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TelemetryModule.forRoot()],
      declarations: [ ProgramHeaderComponent ],
      providers: [ ProgramStageService, ToasterService, ConfigService,
        { provide: Router, useValue: routerStub},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramHeaderComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    component.headerComponentInput = mockRes.inputData;
    fixture.detectChanges();
  });
  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));
  it('should generate tabs based on config', () => {
    const response = [];
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
