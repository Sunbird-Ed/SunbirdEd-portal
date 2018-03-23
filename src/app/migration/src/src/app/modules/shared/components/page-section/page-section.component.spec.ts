import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ICaraouselData} from '../../interfaces/caraouselData';
import { PageSectionComponent } from './page-section.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import { ResourceService, ConfigService  } from '@sunbird/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {Response} from './page-section.component.spec.data';
describe('PageSectionComponent', () => {
  let component: PageSectionComponent;
  let fixture: ComponentFixture<PageSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SlickModule],
      declarations: [ PageSectionComponent ],
      providers: [ ResourceService, ConfigService ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSectionComponent);
    component = fixture.componentInstance;
  });

  it('should show TEST INPUT for success data', () => {
    component.section = Response.successData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .sectionHeading').innerText).toEqual('Multiple Data 1');
    expect(fixture.nativeElement.querySelector('div span.circular').innerText).toEqual('1');
  });
  it('should show TEST INPUT for no contents data', () => {
    component.section = Response.defaultData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .sectionHeading')).toEqual(null);
   expect(fixture.nativeElement.querySelector('div span.circular')).toEqual(null);
  });

});
