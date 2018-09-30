import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardModule } from '../../../../dashboard/dashboard.module';
import { RouterTestingModule } from '@angular/router/testing';
import { LearnModule } from '@sunbird/learn';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UnEnrollBatchComponent } from './unenroll-batch.component';
import { SuiModule } from 'ng2-semantic-ui';
import {SharedModule} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';

describe('UnEnrollBatchComponent', () => {
  let component: UnEnrollBatchComponent;
  let fixture: ComponentFixture<UnEnrollBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule.forRoot(), SuiModule, LearnModule, RouterTestingModule,
        DashboardModule, HttpClientTestingModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnEnrollBatchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
