import { CacheService } from 'ng2-cache-service';
import { HttpClient } from '@angular/common/http';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectionService } from './../../services/connection-service/connection.service';
import { NetworkStatusComponent } from './network-status.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';



 describe('NetworkStatusComponent', () => {
  let component: NetworkStatusComponent;
  let fixture: ComponentFixture<NetworkStatusComponent>;

   beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ NetworkStatusComponent ],
      providers: [ResourceService , ConnectionService , ConfigService, CacheService , BrowserCacheTtlService]
    })
    .compileComponents();
  }));

   beforeEach(() => {
    fixture = TestBed.createComponent(NetworkStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

   it('should create', () => {
    expect(component).toBeTruthy();
  });
});
