import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '../../services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Response } from './sb-card.component.spec.data';
import { SbCardComponent } from './sb-card.component';
import { CacheService } from 'ng2-cache-service';
import { CdnprefixPipe } from '../../pipes/cdnprefix.pipe';
describe('SbCardComponent', () => {
  let component: SbCardComponent;
  let fixture: ComponentFixture<SbCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ SbCardComponent, CdnprefixPipe ],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbCardComponent);
    component = fixture.componentInstance;
  });

  it('should show TEST INPUT for all data', () => {
    const cdnprefixPipe = new CdnprefixPipe();
    component.data = Response.cardData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .description').innerText).toContain('Untitled Collection');
    expect(fixture.nativeElement.querySelector('div .title').innerText).toContain('B1 Test');
    expect(fixture.nativeElement.querySelector('div .right').innerText).toEqual('TextBook');
  });
  it('should show badgeClassImage while passing badgesData', () => {
    const cdnprefixPipe = new CdnprefixPipe();
    component.data = Response.librarySearchData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .description').innerText).toContain('');
    expect(fixture.nativeElement.querySelector('div .title').innerText).toContain('Official Textbook');
    const badgesElm = fixture.nativeElement.querySelector('.avatar');
    expect(badgesElm.src).toContain(Response.librarySearchData.ribbon.left.image);
  });
});
