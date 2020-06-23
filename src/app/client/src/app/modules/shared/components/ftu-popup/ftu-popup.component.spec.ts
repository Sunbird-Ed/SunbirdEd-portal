import { CacheService } from 'ng2-cache-service';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService, ResourceService, BrowserCacheTtlService } from './../../services';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FtuPopupComponent } from './ftu-popup.component';

describe('FtuPopupComponent', () => {
  let component: FtuPopupComponent;
  let fixture: ComponentFixture<FtuPopupComponent>;
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        groupWelcomeTitle: 'Welcome to groups',
      },
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FtuPopupComponent ],
      imports: [HttpClientModule],
      providers: [ { provide: ResourceService, useValue: resourceBundle }, ConfigService, CacheService, BrowserCacheTtlService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtuPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
