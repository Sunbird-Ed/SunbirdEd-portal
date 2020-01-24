import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NospaceContentListComponent } from './nospace-content-list.component';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { SuiModalModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { contantData } from './nospace-content-list.component.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('NospaceContentListComponent', () => {
  let component: NospaceContentListComponent;
  let fixture: ComponentFixture<NospaceContentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NospaceContentListComponent],
      imports: [SuiModalModule, HttpClientTestingModule, SharedModule.forRoot()],
      providers: [
        ResourceService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NospaceContentListComponent);
    component = fixture.componentInstance;
    component.contentlistToShow = contantData.contentList;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('contentlistToShow should be truthy ', () => {
    expect(component.contentlistToShow).toBeTruthy();
  });
  it('should call close modal', () => {
    spyOn(component.dismissed, 'emit');
    component.closeModal();
    expect(component.dismissed.emit).toHaveBeenCalled();
  });
});
