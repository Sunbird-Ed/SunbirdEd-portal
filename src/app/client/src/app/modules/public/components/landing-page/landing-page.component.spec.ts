import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {  SharedModule } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,SharedModule.forRoot()],
      declarations: [LandingPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [HttpClient]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
