import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { PermissionService, LearnerService, UserService } from '@sunbird/core';
import { BulkUploadComponent } from './bulk-upload.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Ng2IzitoastService } from 'ng2-izitoast';

describe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BulkUploadComponent],
      imports: [RouterTestingModule, Ng2IziToastModule],
      providers: [ResourceService, ToasterService, ConfigService, PermissionService, LearnerService, UserService, Ng2IzitoastService, HttpClient, HttpHandler],
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
