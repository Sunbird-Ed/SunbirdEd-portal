import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDrivenFilterComponent } from './data-driven-filter.component';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ConfigService, ToasterService } from '@sunbird/shared';
import { FrameworkService, FormService, ContentService, UserService, LearnerService } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { Observable } from 'rxjs/Observable';
import { expand } from 'rxjs/operators/expand';

describe('DataDrivenFilterComponent', () => {
  let component: DataDrivenFilterComponent;
  let fixture: ComponentFixture<DataDrivenFilterComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const resourceBundle =  {
    'messages': {
        'emsg': {
            'm0005': 'api failed, please try again'
        },
        'stmsg': {
            'm0018': 'We are fetching content...',
            'm0008': 'no-results',
            'm0033': 'You dont have any content'
       }
    }
};
const fakeActivatedRoute = {
  'params': Observable.from([{ pageNumber: '1' }]),
  'queryParams':  Observable.from([{ Grades: ['Grade 2'] }])
};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, SuiModule],
      declarations: [ DataDrivenFilterComponent ],
      providers: [FrameworkService, FormService, UserService, ConfigService, ToasterService, LearnerService, ContentService,
        CacheService, ResourceService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        {provide: ResourceService, useValue: resourceBundle}],
        schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDrivenFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
