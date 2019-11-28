import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CkeditorToolComponent } from './ckeditor-tool.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RouterTestingModule } from '@angular/router/testing';

describe('CkeditorToolComponent', () => {
  let component: CkeditorToolComponent;
  let fixture: ComponentFixture<CkeditorToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CkeditorToolComponent],
      imports: [HttpClientTestingModule, CoreModule, TelemetryModule.forRoot(), SharedModule.forRoot(), SuiModule,
        InfiniteScrollModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CkeditorToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
