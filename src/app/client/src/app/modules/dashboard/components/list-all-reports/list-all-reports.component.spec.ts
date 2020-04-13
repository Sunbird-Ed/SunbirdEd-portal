import { CoreModule } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllReportsComponent } from './list-all-reports.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReportService } from '../../services';

describe('ListAllReportsComponent', () => {
  let component: ListAllReportsComponent;
  let fixture: ComponentFixture<ListAllReportsComponent>;
  const routerStub = { navigate: () => { } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListAllReportsComponent],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, CoreModule],
      providers: [ReportService, { provide: Router, useValue: routerStub }, {
        provide: ActivatedRoute, useValue: {
          snapshot: {
            data: {
              roles: []
            }
          },

        }
      }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
