import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { ContentPlayerComponent } from './content-player.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import {SharedModule, ResourceService, ToasterService, NavigationHelperService, UtilService} from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { playerData } from './content-player.component.spec.data';
import {of as observableOf, Subject} from 'rxjs';
import { configureTestSuite } from '@sunbird/test-util';
import { ContentManagerService } from '../../../public/module/offline/services';

describe('ContentPlayerComponent', () => {
  let component: ContentPlayerComponent;
  let fixture: ComponentFixture<ContentPlayerComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentPlayerComponent],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), RouterModule.forRoot([]), SharedModule.forRoot()],
      providers: [
        ToasterService, NavigationHelperService, { provide: APP_BASE_HREF, useValue: '/' }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPlayerComponent);
    component = fixture.componentInstance;
    const componentInstances = fixture.debugElement.componentInstance;
    componentInstances.playerConfig = playerData.configDetails;
    component.contentProgressEvents$ = new Subject();
    component.contentIframe = { nativeElement: {src: '', onload: () => {}} };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should define player config details', () => {
    expect(component.playerConfig).toBeTruthy();
  });

  it('should call onAssessmentEvents', () => {
    spyOn(component.assessmentEvents, 'emit');
    component.onAssessmentEvents({});
    expect(component.assessmentEvents.emit).toHaveBeenCalled();
  });

  it('should call onAssessmentEvents', () => {
    spyOn(component.questionScoreSubmitEvents, 'emit');
    component.onQuestionScoreSubmitEvents({});
    expect(component.questionScoreSubmitEvents.emit).toHaveBeenCalled();
  });

  it('should make isFullScreenView to FALSE', () => {
    component.isFullScreenView = true;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'contentFullScreenEvent').and.returnValue(observableOf({data: false}));
    component.ngOnInit();
    navigationHelperService.emitFullScreenEvent(false);
    expect(component.isFullScreenView).toBe(false);
  });

  it('should make isFullScreenView to true', () => {
    component.isFullScreenView = false;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'contentFullScreenEvent').and.returnValue(observableOf({data: true}));
    component.ngOnInit();
    navigationHelperService.emitFullScreenEvent(true);
    expect(component.isFullScreenView).toBe(true);
  });
  it('should call deleteContent', () => {
    spyOn(component.deletedContent, 'emit').and.returnValue(playerData.contentId);
    component.deleteContent(playerData.contentId);
    expect(component.deletedContent.emit).toHaveBeenCalledWith(playerData.contentId);
  });
  
  it('should emit deleteContent when content is deleted ', () => {
    const utilService = TestBed.get(UtilService);
    utilService._isDesktopApp = true;
    const contentManagerService = TestBed.get(ContentManagerService);
    spyOn(component, 'deleteContent');
    component.ngOnInit();
    contentManagerService.deletedContent.emit('123');
    expect(component.deleteContent).toHaveBeenCalled();
  });

  it('should checkContentDownloading ', () => {
    component.isDesktopApp = true;
    const contentManagerService = TestBed.get(ContentManagerService);
    spyOn(component, 'deleteContent');
    component.checkContentDownloading(playerData);
    contentManagerService.deletedContent.emit('123');
    expect(component.contentDeleted).toBeFalsy();
  });

});
