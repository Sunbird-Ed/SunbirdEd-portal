import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { SharedModule, ToasterService, NavigationHelperService, LayoutService } from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { ContentPlayerPageComponent } from './contentplayer-page.component';
import { resourceData } from './contentplayer-page.component.spec.data';
import { UtilService } from '../../../shared/services/util/util.service';
import { of, Observable, throwError } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { PublicPlayerService } from '@sunbird/public';

const fakeActivatedRoute = {
  'params': of({contentId: '123'}),
  snapshot: {
    data: {
      telemetry: {
        env: 'library', pageid: 'collection-player', type: 'play'
      }
    },
    queryParams: {}
  }
};

class RouterStub {
  url: '';
  public navigationStart = new NavigationStart(0, '/learn');
  navigate = jasmine.createSpy('navigate');
  public events = new Observable(observer => {
    observer.next(this.navigationStart);
    observer.complete();
  });
}
describe('ContentPlayerComponent', () => {
  let component: ContentPlayerPageComponent;
  let fixture: ComponentFixture<ContentPlayerPageComponent>;

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentPlayerPageComponent],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), RouterModule.forRoot([]), SharedModule.forRoot()],
      providers: [
        ToasterService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub }, { provide: APP_BASE_HREF, useValue: '/' }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPlayerPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    const activateRoute = TestBed.get(ActivatedRoute);
    activateRoute.snapshot.queryParams = {
      contentType: 'course', l1Parent: '1234'
    };
    spyOn(component, 'setPageExitTelemtry').and.callThrough();
    component.telemetryImpression = { context: { env: 'content' }, edata: { type: 'play', uri: '/resources/play/content/do_2130404918568960001454', 'pageid': 'content-player' } };
    component.ngOnInit();
    expect(component.contentType).toEqual('course');
    expect(component.setPageExitTelemtry).toHaveBeenCalled();
    expect(component.objectRollUp).toBeDefined();
  });

  it('should get contentId from route params', () => {
    const activateRoute = TestBed.get(ActivatedRoute);
    spyOn(component, 'getContent').and.callThrough();
    component.getContentIdFromRoute();
    activateRoute.params.contentId = '123';
    expect(component.contentId).toEqual('123');
    expect(component.getContent).toHaveBeenCalled();
  });

  it('should call onAssessmentEvents', () => {
    spyOn(component.assessmentEvents, 'emit');
    component.onAssessmentEvents({});
    expect(component.assessmentEvents.emit).toHaveBeenCalled();
  });

  it('should call questionScoreSubmitEvents', () => {
    spyOn(component.questionScoreSubmitEvents, 'emit');
    component.onQuestionScoreSubmitEvents({});
    expect(component.questionScoreSubmitEvents.emit).toHaveBeenCalled();
  });

  it('should unsubscribe all the active subscription', () => {
    const utilService = TestBed.get(UtilService);
    spyOn(utilService, 'emitHideHeaderTabsEvent');
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
    expect(utilService.emitHideHeaderTabsEvent).toHaveBeenCalledWith(false);
  });

  it('should set Telemetry object', () => {
    component.contentDetails = {
      identifier: 'do_123343432',
      contentType: 'Resource',
      pkgVersion: 2
    };
    component.telemetryImpression = { context: { env: 'content' }, edata: { type: 'play', uri: '/resources/play/content/do_2130404918568960001454', 'pageid': 'content-player' } };
    component.setPageExitTelemtry();
    expect(component.telemetryImpression.edata.subtype).toEqual('pageexit');
    expect(component.telemetryImpression).toBeDefined();
  });

  it('should call logTelemetry', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    component.logTelemetry('do_3434223');
    expect(telemetryService.interact).toHaveBeenCalled();
  });

  it('should navigate back to previously accessed page', () => {
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(component, 'logTelemetry');
    spyOn(navigationHelperService, 'goBack');
    component.goBack();
    expect(component.logTelemetry).toHaveBeenCalledWith('close-content-player');
    expect(navigationHelperService.goBack).toHaveBeenCalled();
  });

  it('should call checkContentDownloading', () => {
    spyOn(component.isContentDeleted, 'next');
    spyOn(component.contentDownloaded, 'emit');
    component.checkContentDownloading({});
    expect(component.isContentDeleted.next).toHaveBeenCalledWith({ value: false });
    expect(component.contentDownloaded.emit).toHaveBeenCalled();
  });

  it('should get content and check conetent is not deleted for desktop app', () => {
    component.isDesktopApp = true;
    const playerService = TestBed.get(PublicPlayerService);
    spyOn(playerService, 'getContent').and.returnValue(of(resourceData.content));
    spyOn(component, 'getContentConfigDetails');
    spyOn(component.isContentDeleted, 'next');
    component.getContent();
    expect(component.getContentConfigDetails).toHaveBeenCalled();
    expect(component.isContentDeleted.next).toHaveBeenCalledWith({ value: false });
  });

  it('should get content and check conetent is deleted for desktop app', () => {
    component.isDesktopApp = true;
    const playerService = TestBed.get(PublicPlayerService);
    spyOn(playerService, 'getContent').and.returnValue(throwError({}));
    spyOn(component.isContentDeleted, 'next');
    component.getContent();
    expect(component.isContentDeleted.next).toHaveBeenCalledWith({ value: true });
  });

  it('should call checkContentDeleted', () => {
    component.contentDetails = { identifier: 'do_123343432', contentType: 'Resource', pkgVersion: 2 };
    component.isConnected = true;
    component.isDesktopApp = true;
    const router = TestBed.get(Router);
    router.url = 'http://localhost:3000/resources/play/collection/do_11263298042220544013?contentType=TextBook';
    spyOn(component.isContentDeleted, 'next');
    spyOn(component.deletedContent, 'emit');
    component.checkContentDeleted('do_121121');
    expect(component.isContentDeleted.next).toHaveBeenCalledWith({ value: true });
    expect(component.deletedContent.emit).toHaveBeenCalledWith(component.contentDetails);
  });

  it('should call getContentConfigDetails', () => {
    component.objectRollUp = { l1: 'do_1211212', l2: 'do_34343221' };
    component.playerConfig = { context: { objectRollup: {} } };
    component.getContentConfigDetails('do_121121', {});
    expect(component.playerConfig.context.objectRollup).toEqual(component.objectRollUp);
  });

  it('should call getContent', () => {
    component.dialCode = 'PQRCTS';
    component.getContent();
  });

  it('should call ngOnChanges', () => {
    component.contentDetails = { identifier: 'do_123343432', contentType: 'Resource', pkgVersion: 2 };
    component.tocPage = true;
    spyOn(component, 'getContent');
    component.ngOnChanges();
    expect(component.contentId).toEqual('do_123343432');
    expect(component.getContent).toHaveBeenCalled();
  });

  it('should call initLayout', () => {
    const layoutService = TestBed.get(LayoutService);
    spyOn(layoutService, 'initlayoutConfig').and.returnValue({ 'source': '', 'name': 'newLayout', 'options': '' });
    spyOn(layoutService, 'switchableLayout').and.returnValue(of({ layout: '' }));
    component.initLayout();
    expect(component.layoutConfiguration).toBeDefined();
  });

  it('should call setTelemetryData', () => {
    component.dialCode = 'PQRCTS';
    const router = TestBed.get(Router);
    router.url = 'http://localhost:3000/resources/play/collection/do_11263298042220544013?contentType=TextBook';
    component.contentDetails = { identifier: 'do_123343432', contentType: 'Resource', pkgVersion: 2 };
    component.tocPage = false;
    component.setTelemetryData();
    expect(component.telemetryImpression).toBeDefined();
  });

  it('should logTelemetry with defalut value', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const activateRoute = TestBed.get(ActivatedRoute);
    delete activateRoute.snapshot.data.telemetry;
    spyOn(telemetryService, 'interact');
    component.logTelemetry('do_3434223');
    expect(telemetryService.interact).toHaveBeenCalled();
  });



});
