import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextbookListComponent } from './textbook-list.component';
import { TelemetryModule } from '@sunbird/telemetry';
import {
  ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService
} from '@sunbird/shared';
import { CoreModule, PublicDataService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf, throwError as observableError } from 'rxjs';

describe('TextbookListComponent', () => {
  let component: TextbookListComponent;
  let fixture: ComponentFixture<TextbookListComponent>;
  let sampleResponseData = { result: { content: [{ identifier: '1', status: 'Draft' }, { identifier: '2', status: 'Live' }, { identifier: '2', status: 'Draft' }] } }
  let sampleEventData = { data: { metaData: { identifier: '1' } } }, errorInitiate;
  const PublicDataServiceStub = {
    post() {
      if (errorInitiate) {
        return observableError({  status: 404  });
      } else {
        return observableOf(sampleResponseData);
      }
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TelemetryModule, SharedModule.forRoot(), CoreModule, RouterTestingModule, TelemetryModule.forRoot()],
      declarations: [TextbookListComponent],
      providers: [{ provide: PublicDataService, useValue: PublicDataServiceStub }, ConfigService, UtilService, ToasterService, TelemetryService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextbookListComponent);
    component = fixture.componentInstance;
    component.selectedAttributes = {
      board: "NCERT",
      framework: "NCFCOPY",
      gradeLevel: "Kindergarten",
      subject: "Hindi",
      medium: "English",
      programId: "31ab2990-7892-11e9-8a02-93c5c62c03f1"
    },
      errorInitiate = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should return Textbooklist', () => {
    component.ngOnInit();
    expect(component.textbookList.length).toBeGreaterThan(1);
  });

  it('Should emit event on select of textbook', () => {
    spyOn(component.selectedTextbookEvent, 'emit').and.callThrough();
    component.showTopics(sampleEventData);
    expect(component.selectedTextbookEvent.emit).toHaveBeenCalledWith('1');
  });

  it('Should throw error when fetching textbook fails', () => {
    errorInitiate = true;
    spyOn(component.toasterService, 'error');
    spyOn(component.telemetryService, 'error');
    component.ngOnInit();
   expect(component.toasterService.error).toHaveBeenCalledWith('Fetching TextBook failed');
   expect(component.telemetryService.error).toHaveBeenCalled();
  });

});
