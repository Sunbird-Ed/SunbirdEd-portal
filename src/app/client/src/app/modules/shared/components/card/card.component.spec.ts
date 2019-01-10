import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '../../services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './card.component.spec.data';
import { CardComponent } from './card.component';
import { CacheService } from 'ng2-cache-service';
import { CdnprefixPipe } from '../../pipes/cdnprefix.pipe';
describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ CardComponent, CdnprefixPipe ],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  it('should show TEST INPUT for all data', () => {
    component.data = Response.cardData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .title').innerText).toContain('B1 Test');
    expect(fixture.nativeElement.querySelector('div .right').innerText).toEqual('Worksheet');
  });
  it('should show badgeClassImage while passing badgesData', () => {
    component.data = Response.librarySearchData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .title').innerText).toContain('Official Textbook');
    const badgesElm = fixture.nativeElement.querySelector('.avatar');
    expect(badgesElm.src).toContain(Response.librarySearchData.ribbon.left.image);
  });
});
