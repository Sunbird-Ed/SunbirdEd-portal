import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, ConfigService } from '../../services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
 import { Response } from './card.component.spec.data';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ CardComponent ],
      providers: [ResourceService, ConfigService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  xit('should show TEST INPUT for all data', () => {
    component.data = Response.successData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .card-component-description').innerText).toEqual('testing for description');
    expect(fixture.nativeElement.querySelector('div .text-cencapitalize').innerText).toEqual('testing1');
    expect(fixture.nativeElement.querySelector('div .right').innerText).toEqual('resource');
    expect(fixture.nativeElement.querySelector('img').src).toEqual(Response.successData.image);
  });

  xit('should show TEST INPUT for default data', () => {
    component.data = Response.defaultData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .card-component-description').innerText).toEqual( Response.defaultData.description);
    expect(fixture.nativeElement.querySelector('div .text-cencapitalize').innerText).toEqual('testing2');
  });
});
