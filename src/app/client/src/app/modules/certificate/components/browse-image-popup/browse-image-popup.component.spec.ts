import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseImagePopupComponent } from './browse-image-popup.component';
import { SuiModule } from 'ng2-semantic-ui';
import { BrowserCacheTtlService, ConfigService, NavigationHelperService, ToasterService, UtilService, ResourceService } from '@sunbird/shared';
import { TranslateService, TranslateStore } from '@ngx-translate/core';


describe('BrowseImagePopupComponent', () => {
  let component: BrowseImagePopupComponent;
  let fixture: ComponentFixture<BrowseImagePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, FormsModule, CoreModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
      ConfigService,
      ToasterService,
      ResourceService,
      UtilService,
      BrowserCacheTtlService,
      TranslateService,
      TranslateStore
    ],
      declarations: [ BrowseImagePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseImagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
