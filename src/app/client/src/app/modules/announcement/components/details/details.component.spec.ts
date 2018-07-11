import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import * as testData from './details.component.spec.data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, ConfigService, DateFormatPipe, BrowserCacheTtlService } from '@sunbird/shared';
import { DetailsComponent, IAnnouncementDetails } from '@sunbird/announcement';
import { CacheService } from 'ng2-cache-service';
describe('AnnouncementInboxCardComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      declarations: [DetailsComponent, DateFormatPipe],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
  });

  it('should show TEST data in html element', () => {
    component.announcementDetails = testData.mockRes.detailsObject;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div p.annType').innerText).toEqual('CIRCULAR');
    expect(fixture.nativeElement.querySelector('div .segment-heading').innerText).toEqual('Test title');
    expect(fixture.nativeElement.querySelector('div .announcement-description').innerText).toEqual('Test description');
    expect(fixture.nativeElement.querySelector('div .ann-details-sent-date-bg').innerText).toEqual('25th February 2018');
  });
});


