import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import * as testData from './details.component.spec.data';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

// Modules
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Ng2IziToastModule } from 'ng2-izitoast';

import { SharedModule, ResourceService, ToasterService, ConfigService, RouterNavigationService } from '@sunbird/shared';
import { DetailsComponent } from './details.component';

xdescribe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule,
        SuiModule, SharedModule],
      providers: [HttpClientModule, RouterNavigationService,
        ResourceService, ToasterService, ConfigService, HttpClient,
        { provide: Router, useClass: RouterStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

