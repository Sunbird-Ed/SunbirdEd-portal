import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentManagerInfoPopUpComponent } from './content-manager-info-pop-up.component';
import {contantData} from './content-manager-info-pop-up.component.spec.data';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { SuiModalModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('ContentManagerInfoPopUpComponent', () => {
  let component: ContentManagerInfoPopUpComponent;
  let fixture: ComponentFixture<ContentManagerInfoPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentManagerInfoPopUpComponent ],
      imports: [SuiModalModule, HttpClientTestingModule, SharedModule.forRoot()],
      providers: [
        ResourceService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentManagerInfoPopUpComponent);
    component = fixture.componentInstance;
    component.failedList = contantData.contentList;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('contentlistToShow should be truthy ', () => {
    expect(component.failedList).toBeTruthy();
  });
  it('should call close modal', () => {
    spyOn(component.dismissed, 'emit');
    component.closeModal();
    expect(component.dismissed.emit).toHaveBeenCalled();
  });
});
