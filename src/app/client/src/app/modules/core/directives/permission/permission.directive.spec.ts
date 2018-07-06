import { mockUserData } from './../../services/user/user.mock.spec.data';
import { PermissionDirective } from './permission.directive';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfigService, ResourceService, ToasterService , BrowserCacheTtlService} from '@sunbird/shared';
import { UserService, LearnerService, PermissionService, ContentService } from '@sunbird/core';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { CacheService } from 'ng2-cache-service';
@Component({
  template: `<a appPermission id="permission" [permission]= 'adminDashboard'
  href="#">dashboard</a>`
})
class TestWrapperComponent {
  adminDashboard = [];
}
describe('PermissionDirective', () => {
  let component: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, Ng2IziToastModule],
      declarations: [PermissionDirective, TestWrapperComponent],
      providers: [ToasterService, ResourceService, PermissionService, UserService,
      CacheService, ContentService, ConfigService, LearnerService, HttpClient, BrowserCacheTtlService]
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
  });
  it('should create an instance', () => {
    fixture.detectChanges();
  });
});
