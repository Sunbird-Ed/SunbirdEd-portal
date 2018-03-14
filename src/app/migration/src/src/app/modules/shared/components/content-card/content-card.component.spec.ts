import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {IContents} from '../../interfaces/content';
import { ContentCardComponent } from './content-card.component';
import { ResourceService , ConfigService} from '../../services/index';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {By} from '@angular/platform-browser';
import * as mockData from './content-card.component.spec.data';
const testData = mockData.mockRes;

describe('ContentCardComponent', () => {
  let component: ContentCardComponent;
  let fixture: ComponentFixture<ContentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ContentCardComponent ],
      providers: [ ResourceService, ConfigService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentCardComponent);
    component = fixture.componentInstance;
  });


  it('should show TEST INPUT for success data', () => {
    component.content = testData.successData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .description').innerText).toEqual('Test');
    expect(fixture.nativeElement.querySelector('div .text-cencapitalize').innerText).toEqual('Test1182016-02');
    expect(fixture.nativeElement.querySelector('div a.label').innerText).toEqual('story');
    expect(fixture.nativeElement.querySelector('div span.right').innerText).toEqual(' Resume');
  });
  it('should show TEST INPUT for default data', () => {
    component.content = testData.defaultData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .description')).toEqual(null);
    expect(fixture.nativeElement.querySelector('div .text-cencapitalize').innerText).toEqual('Test1182016-02');
    expect(fixture.nativeElement.querySelector('div a.label').innerText).toEqual('Course');
  });
});
