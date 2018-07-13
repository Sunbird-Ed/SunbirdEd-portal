import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, ConfigService } from '../../services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Response } from './card.component.spec.data';
import { CardComponent } from './card.component';
import { CdnprefixPipe } from '../../pipes/cdnprefix.pipe';
describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ CardComponent, CdnprefixPipe ],
      providers: [ResourceService, ConfigService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  it('should show TEST INPUT for all data', () => {
    const cdnprefixPipe = new CdnprefixPipe();
    component.data = Response.cardData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .card-component-description').innerText).toContain('Untitled Collection');
    expect(fixture.nativeElement.querySelector('div .text-cencapitalize').innerText).toContain('B1 Test');
    expect(fixture.nativeElement.querySelector('div .right').innerText).toEqual('TextBook');
  });
  it('should emit the event on click of trash icon', () => {
    component.data = Response.cardData;
    fixture.detectChanges();
    const trashIconElm = fixture.debugElement.nativeElement.querySelector('i');
    spyOn(component, 'onAction').and.callThrough();
    spyOn(component.clickEvent, 'emit');
    trashIconElm.dispatchEvent(new Event('click'));
    expect(component.onAction).toHaveBeenCalledWith(Response.cardData, Response.cardData.action.right);
    expect(component.clickEvent.emit).toHaveBeenCalledWith(Response.emitData);
  });
  it('should show badgeClassImage while passing badgesData', () => {
    const cdnprefixPipe = new CdnprefixPipe();
    component.data = Response.librarySearchData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .card-component-description').innerText).toContain('');
    expect(fixture.nativeElement.querySelector('div .text-cencapitalize').innerText).toContain('Official Textbook');
    const badgesElm = fixture.nativeElement.querySelector('div .avatar');
    expect(badgesElm.src).toContain(Response.librarySearchData.ribbon.left.image);
  });
});
