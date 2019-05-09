import { CacheService } from 'ng2-cache-service';
import { ContentImportComponent } from './../content-import/content-import.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentImportHeaderComponent } from './content-import-header.component';
import { SuiModalModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContentImportHeaderComponent', () => {
  let component: ContentImportHeaderComponent;
  let fixture: ComponentFixture<ContentImportHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModalModule, SharedModule.forRoot(), HttpClientTestingModule],
      declarations: [ ContentImportHeaderComponent, ContentImportComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentImportHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
