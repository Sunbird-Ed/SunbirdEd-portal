import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsAndLicenceComponent } from './credits-and-licence.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { contentInformation } from './credits-and-licence.component.spec.data';
import { configureTestSuite } from '@sunbird/test-util';

describe('CreditsAndLicenceComponent', () => {
  let component: CreditsAndLicenceComponent;
  let fixture: ComponentFixture<CreditsAndLicenceComponent>;

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
      declarations: [CreditsAndLicenceComponent],
      imports: [CommonConsumptionModule, BrowserAnimationsModule, SharedModule.forRoot()],
      providers: [{ provide: ResourceService, useValue: resourceBundle }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditsAndLicenceComponent);
    component = fixture.componentInstance;
    component.contentData = contentInformation.contentData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should check the content data is defined or not ', () => {
    expect(component.contentData).toBeTruthy();
  });
});
