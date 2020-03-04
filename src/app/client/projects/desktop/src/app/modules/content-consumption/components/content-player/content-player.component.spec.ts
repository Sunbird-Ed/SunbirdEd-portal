import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPlayerComponent } from './content-player.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { playerData } from './content-player.component.spec.data';
import { Subject } from 'rxjs';
import { ConnectionService } from '@sunbird/offline';
import { of, throwError } from 'rxjs';
import { OfflineCardService } from '@sunbird/shared';
describe('ContentPlayerComponent', () => {
  let component: ContentPlayerComponent;
  let fixture: ComponentFixture<ContentPlayerComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentPlayerComponent],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), RouterModule.forRoot([]), SharedModule.forRoot()],
      providers: [
         ConnectionService, ToasterService,
           OfflineCardService
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
  it('should call ngAfterViewInit', () => {
    spyOn(component, 'loadPlayer').and.callThrough();
    component.ngAfterViewInit();
    expect(component.isContentDeleted).toBeFalsy();
    expect(component.loadPlayer).toHaveBeenCalled();
  });
  it('should call ngOnChanges', () => {
    spyOn(component, 'loadPlayer').and.callThrough();
    component.contentRatingModal = false;
    component.ngOnChanges();
    expect(component.isContentDeleted).toBeFalsy();
    expect(component.loadPlayer).toHaveBeenCalled();
  });
  it('should call deleteContent', () => {
    spyOn(component.deletedContent, 'emit').and.returnValue(playerData.contentId);
    component.deleteContent(playerData.contentId);
    expect(component.deletedContent.emit).toHaveBeenCalledWith(playerData.contentId);
  });
  it('should call generateContentReadEvent', () => {
    let contentProgressEvent;
    component.contentProgressEvents$.subscribe((data) => {
      contentProgressEvent = data;
    });
    spyOn(component.assessmentEvents, 'emit').and.returnValue(playerData.generateContentReadEvent);
    component.generateContentReadEvent(playerData.generateContentReadEvent);
    expect(component.assessmentEvents.emit).toHaveBeenCalledWith(playerData.generateContentReadEvent);
  });
  it('should call generateContentReadEvent and IMPRESSION event', () => {
    let contentProgressEvent;
    component.contentProgressEvents$.subscribe((data) => {
      contentProgressEvent = data;
    });
    spyOn(component, 'emitSceneChangeEvent');
    component.generateContentReadEvent(playerData.generateContentImpressionEvent);
    expect(component.emitSceneChangeEvent).toHaveBeenCalled();
  });
  it('should call generateScoreSubmitEvent', () => {
    spyOn(component.questionScoreSubmitEvents, 'emit' );
    component.generateScoreSubmitEvent(playerData.generateScoreSubmitEvent);
    expect(component.questionScoreSubmitEvents.emit).toHaveBeenCalledWith(playerData.generateScoreSubmitEvent);
  });
  it('should call  loadCdnPlayer ', () => {
    component.contentData = playerData.content.result;
  component.loadCdnPlayer();
 component.contentIframe.nativeElement.onload( data => {
   expect(component.adjustPlayerHeight).toHaveBeenCalled();
   expect(component.generateContentReadEvent).toHaveBeenCalled();
 });
  });
  it('should call  loadDefaultPlayer ', () => {
    component.contentData = playerData.content.result;
  component.loadDefaultPlayer();
 component.contentIframe.nativeElement.onload( data => {
   expect(component.adjustPlayerHeight).toHaveBeenCalled();
   expect(component.generateContentReadEvent).toHaveBeenCalled();
 });
  });

  it('should handle youtube content when online and isYoutubeContent is true', () => {
    const connectionService = TestBed.get(ConnectionService);
    const offlineCardService = TestBed.get(OfflineCardService);
    spyOn(offlineCardService, 'isYoutubeContent').and.returnValue(of(true));
    spyOn(connectionService, 'monitor').and.returnValue(of(true));
    component.handleYoutubeContent(playerData.content.result.content);
    expect(component.youTubeContentStatus).toBeFalsy();
  });
  it('should handle youtube content when offline and isYoutubeContent is true', () => {
    const connectionService = TestBed.get(ConnectionService);
    const offlineCardService = TestBed.get(OfflineCardService);
    spyOn(offlineCardService, 'isYoutubeContent').and.returnValue(of(true));
    spyOn(connectionService, 'monitor').and.returnValue(of(false));
    component.handleYoutubeContent(playerData.content.result.content);
    expect(component.youTubeContentStatus).toBeTruthy();
  });
  it('should handle youtube content when online and isYoutubeContent is false', () => {
    const connectionService = TestBed.get(ConnectionService);
    const offlineCardService = TestBed.get(OfflineCardService);
    spyOn(offlineCardService, 'isYoutubeContent').and.returnValue(of(false));
    spyOn(connectionService, 'monitor').and.returnValue(of(true));
    component.handleYoutubeContent(playerData.content.result.content);
    expect(component.youTubeContentStatus).toBeFalsy();
  });

});
