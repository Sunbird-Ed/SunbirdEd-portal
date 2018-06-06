import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, ToasterService, ConfigService, SharedModule } from '@sunbird/shared';
import { PermissionService, LearnerService, CoreModule } from '@sunbird/core';
import { BulkUploadComponent } from './bulk-upload.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
describe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BulkUploadComponent],
      imports: [RouterTestingModule, Ng2IziToastModule, HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot()],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
