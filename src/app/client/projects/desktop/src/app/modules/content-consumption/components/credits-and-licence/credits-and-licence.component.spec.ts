import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsAndLicenceComponent } from './credits-and-licence.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { ResourceService } from 'src/app/modules/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreditsAndLicenceComponent],
      imports: [CommonConsumptionModule, BrowserAnimationsModule],
      providers: [{ provide: ResourceService, useValue: resourceBundle }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditsAndLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call embedUrl', () => {
    const returnVal = component.embedUrl(undefined);
    expect(returnVal).toBe('');
  });

  it('should return text with embedded URL', () => {
    const returnVal = component.embedUrl('this is a demo url: http://google.com');
    expect(returnVal).toBe('this is a demo url: <a href="http://google.com">http://google.com</a>');
  });
});
