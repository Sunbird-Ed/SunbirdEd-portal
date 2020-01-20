import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, ConfigService, BrowserCacheTtlService, UtilService, OfflineCardService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Response } from './offline-card.component.spec.data';
import { OfflineCardComponent } from './offline-card.component';
import { CacheService } from 'ng2-cache-service';
import { CdnprefixPipe } from '../../pipes/cdnprefix.pipe';

describe('OfflineCardComponent', () => {
  let component: OfflineCardComponent;
  let fixture: ComponentFixture<OfflineCardComponent>;

  const resourceServiceMockData = {
    messages: {
      stmsg: { m0140: 'DOWNLOADING' },
    }
  };
  const fakeActivatedRoute = { snapshot: { data: { telemetry: { pageid: 'browse' } } } };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OfflineCardComponent, CdnprefixPipe],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService, UtilService, OfflineCardService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        {provide: ResourceService, useValue: resourceServiceMockData}],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineCardComponent);
    component = fixture.componentInstance;
  });

  it('should show TEST INPUT for all data', () => {
    const cdnprefixPipe = new CdnprefixPipe();
    component.data = Response.cardData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sb-card-title').innerText).toContain('B1 Test');
    expect(fixture.nativeElement.querySelector('.sb-card-label').innerText).toEqual('Worksheet');
  });
  it('should show badgeClassImage while passing badgesData', () => {
    const cdnprefixPipe = new CdnprefixPipe();
    component.data = Response.librarySearchData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sb-card-title').innerText).toContain('Official Textbook');
    const badgesElm = fixture.nativeElement.querySelector('.sb-card-badge');
    expect(badgesElm.src).toContain(Response.librarySearchData.ribbon.left.image);
  });

  it('should emit click event  on call of onAction method ', () => {
    const cdnprefixPipe = new CdnprefixPipe();
    component.data = Response.cardData;
    spyOn(component.clickEvent, 'emit');
    component.onAction(component.data, 'export');
    expect(component.clickEvent.emit).toHaveBeenCalledTimes(1);
    expect(component.data.downloadStatus).toBeUndefined();
  });

  it('should emit change addingto librarybutton to true if the action is download in onAction ', () => {
    const cdnprefixPipe = new CdnprefixPipe();
    component.data = Response.cardData;
    spyOn(component.clickEvent, 'emit');
    component.data = Response.cardData;
    const offlineCardService = TestBed.get(OfflineCardService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    spyOn(offlineCardService, 'isYoutubeContent').and.returnValue(true);
    component.onAction(component.data, 'download');
    expect(component.showModal).toBe(true);
    expect(Response.emitData.data.downloadStatus).toBe(resourceService.messages.stmsg.m0140);  });

  it('initially offlineRoute should be library', () => {
    expect(component.currentRoute).toBe('library');
  });

  it('should call getPlayerDownloadStatus()', () => {
    const utilService = TestBed.get(UtilService);
    spyOn(utilService, 'getPlayerDownloadStatus').and.returnValue(true);
    component.currentRoute = 'browse';
    component.checkStatus('DOWNLOAD');
    expect(utilService.getPlayerDownloadStatus).toHaveBeenCalled();
  });

});
