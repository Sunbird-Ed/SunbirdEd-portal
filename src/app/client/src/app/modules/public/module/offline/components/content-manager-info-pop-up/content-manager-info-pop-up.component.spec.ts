import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentManagerInfoPopUpComponent } from './content-manager-info-pop-up.component';
import { contantData } from './content-manager-info-pop-up.component.spec.data';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { SuiModalModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';

describe('ContentManagerInfoPopUpComponent', () => {
  let component: ContentManagerInfoPopUpComponent;
  let fixture: ComponentFixture<ContentManagerInfoPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentManagerInfoPopUpComponent],
      imports: [SuiModalModule, HttpClientTestingModule, SharedModule.forRoot(), RouterModule.forRoot([])],
      providers: [
        ResourceService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  configureTestSuite();
  beforeEach(() => {
    fixture = TestBed.createComponent(ContentManagerInfoPopUpComponent);
    component = fixture.componentInstance;
    component.failedList = contantData.contentList;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('contentListToShow should be truthy ', () => {
    expect(component.failedList).toBeTruthy();
  });
  it('should call close modal', () => {
    spyOn(component.dismissed, 'emit');
    component.closeModal('D:');
    expect(component.dismissed.emit).toHaveBeenCalledWith({ selectedDrive: 'D:' });
  });
  it('should call getDriveSelectInteractEdata', () => {
    const selectedDrive = {
      label: 'D: (Recommended)',
      name: 'D:'
    };
    const selectDriveInteractEdata = {
      id: 'content-location-select-button',
      type: 'click',
      pageid: 'library',
      extra: {
        drive: 'D:'
      }
    };
    const resp: IInteractEventEdata = component.getDriveSelectInteractEdata(selectedDrive);
    expect(resp).toEqual(selectDriveInteractEdata);
  });
});
