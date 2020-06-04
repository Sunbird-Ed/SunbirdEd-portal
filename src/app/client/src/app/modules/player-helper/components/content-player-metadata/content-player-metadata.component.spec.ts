import { CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentPlayerMetadataComponent } from './content-player-metadata.component';
import {mockRes} from './contnet-player-metadata.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { configureTestSuite } from '@sunbird/test-util';

describe('ContentPlayerMetadataComponent', () => {
  let component: ContentPlayerMetadataComponent;
  let fixture: ComponentFixture<ContentPlayerMetadataComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), HttpClientTestingModule, CoreModule],
      declarations: [ContentPlayerMetadataComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPlayerMetadataComponent);
    component = fixture.componentInstance;
  });

  it('should Take INPUT for content MetaData and show Attribution field  ', () => {
    component.contentData = mockRes.contentData;
    component.ngOnInit();
    expect(component.metadata.attributions).toEqual('Text Attribution');
  });
});
