// import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
// import * as testData from './details.component.spec.data';
// import { Component, OnInit } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import { HttpClient } from '@angular/common/http';

// // Modules
// import { SuiModule } from 'ng2-semantic-ui';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { HttpClientModule } from '@angular/common/http';
// import { ActivatedRoute, RouterModule, Router } from '@angular/router';
// import { Ng2IziToastModule } from 'ng2-izitoast';

// import { SharedModule, ResourceService, ToasterService, ConfigService, RouterNavigationService } from '@sunbird/shared';
// import { DetailsComponent } from './details.component';

// describe('DetailsComponent', () => {
//   let component: DetailsComponent;
//   let fixture: ComponentFixture<DetailsComponent>;
//   class RouterStub {
//     navigate = jasmine.createSpy('navigate');
//   }

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [DetailsComponent],
//       imports: [HttpClientTestingModule, Ng2IziToastModule,
//         SuiModule, SharedModule],
//       providers: [HttpClientModule, RouterNavigationService,
//         ResourceService, ToasterService, ConfigService, HttpClient,
//         { provide: Router, useClass: RouterStub }
//       ]
//     })
//       .compileComponents();
//   }));

//   beforeEach(async(() => {
//     fixture = TestBed.createComponent(DetailsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   }));

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

// });


import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import * as testData from './details.component.spec.data';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import 'rxjs/add/operator/mergeMap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
// Import services
import { ResourceService, ConfigService, DateFormatPipe } from '@sunbird/shared';
import { DetailsComponent, IAnnouncementDetails } from '@sunbird/announcement';
// Test data

describe('AnnouncementInboxCardComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      declarations: [DetailsComponent, DateFormatPipe],
      providers: [ResourceService, ConfigService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
  });

  it('should show TEST data in html element', () => {
    component.announcementDetails = testData.mockRes.detailsObject;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div p.annType').innerText).toEqual('CIRCULAR');
    expect(fixture.nativeElement.querySelector('div .announcementHomeCard-header').innerText).toEqual('Test title');
    expect(fixture.nativeElement.querySelector('div .announcement-description').innerText).toEqual('Test description');
    expect(fixture.nativeElement.querySelector('div .announcementSentOnDate').innerText).toEqual('25th February 2018');
  });
});


