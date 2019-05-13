import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentImportComponent } from './content-import.component';
import { OfflineFileUploaderService } from '../../services';
import { SuiModalModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContentImportComponent', () => {
  let component: ContentImportComponent;
  let fixture: ComponentFixture<ContentImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SuiModalModule, SharedModule.forRoot(), HttpClientTestingModule ],
      declarations: [ContentImportComponent],
      providers: [ OfflineFileUploaderService ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
