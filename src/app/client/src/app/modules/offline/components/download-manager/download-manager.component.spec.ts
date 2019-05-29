import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadManagerComponent } from './download-manager.component';
import { DownloadManagerService } from '../../services';
import { SuiModalModule, SuiProgressModule, SuiAccordionModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {FileSizeModule} from 'ngx-filesize';
import { OrderModule } from 'ngx-order-pipe';

describe('DownloadManagerComponent', () => {
  let component: DownloadManagerComponent;
  let fixture: ComponentFixture<DownloadManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SuiModalModule, SharedModule.forRoot(), SuiProgressModule, SuiAccordionModule, HttpClientTestingModule,
        FileSizeModule, OrderModule ],
      declarations: [DownloadManagerComponent],
      providers: [ DownloadManagerService ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return proper progress value', () => {
    const progressData = component.showProgressValue(50, 100);
    expect(progressData).toBe(50);
  });

});

