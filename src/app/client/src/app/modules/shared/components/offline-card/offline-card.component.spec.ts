import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Response } from './offline-card.component.spec.data';
import { OfflineCardComponent } from './offline-card.component';
import { CacheService } from 'ng2-cache-service';
import { CdnprefixPipe } from '../../pipes/cdnprefix.pipe';
describe('CardComponent', () => {
  let component: OfflineCardComponent;
  let fixture: ComponentFixture<OfflineCardComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  class FakeActivatedRoute {
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ OfflineCardComponent, CdnprefixPipe ],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
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
});

