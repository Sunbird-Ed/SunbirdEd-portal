import { RouterTestingModule } from '@angular/router/testing';
import { ContentImportComponent } from './../content-import/content-import.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentImportHeaderComponent } from './content-import-header.component';
import { SuiModalModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule } from '@sunbird/telemetry';


describe('ContentImportHeaderComponent', () => {
  let component: ContentImportHeaderComponent;
  let fixture: ComponentFixture<ContentImportHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TelemetryModule.forRoot(), SuiModalModule, SharedModule.forRoot(), HttpClientTestingModule],
      declarations: [ContentImportHeaderComponent, ContentImportComponent],
      providers: [ResourceService]
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
