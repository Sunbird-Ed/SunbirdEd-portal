import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { ContentLicenceComponent } from './content-licence.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { contentInformation } from './content-licence.component.spec.data';

describe('CreditsAndLicenceComponent', () => {
  let component: ContentLicenceComponent;
  let fixture: ComponentFixture<ContentLicenceComponent>;

  const resourceBundle = {
    frmelmnts: {
      lbl: {
        desktop: {
          creditsAndLicenceInfo: 'Credits And Licence Info',
          authorOfSourceContent: 'Author of the Source Content',
          content: 'Content'
        }
      }
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentLicenceComponent],
      imports: [CommonConsumptionModule, BrowserAnimationsModule, SharedModule.forRoot()],
      providers: [{ provide: ResourceService, useValue: resourceBundle }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentLicenceComponent);
    component = fixture.componentInstance;
    component.content = contentInformation.contentData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should check the content data is defined or not ', () => {
    expect(component.content).toBeTruthy();
  });
  it('should check the attributions', () => {
    component.content = contentInformation.contentData;
    component.ngOnInit();
    expect(component.attributions).toEqual(contentInformation.contentData.attributions);
  });
});
