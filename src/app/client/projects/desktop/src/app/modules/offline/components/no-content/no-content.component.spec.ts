import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoContentComponent } from './no-content.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('NoContentComponent', () => {
  let component: NoContentComponent;
  let fixture: ComponentFixture<NoContentComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoContentComponent],
      imports: [SharedModule.forRoot(), HttpClientTestingModule],
      providers: [ { provide: Router, useClass: RouterStub } ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call checkConnectionStatus', () => {
    spyOn(component, 'checkConnectionStatus');
    spyOn(component.connectionService, 'monitor').and.returnValue(of(true));
    component.connectionService.monitor().subscribe(connected => {
      expect(connected).toBeTruthy();
    });
    component.ngOnInit();
    expect(component.checkConnectionStatus).toHaveBeenCalled();
    expect(component.isConnected).toBeTruthy();
  });

  it('should change modal value', () => {
    expect(component.showModal).toBeFalsy();
    component.handleModal();
    expect(component.showModal).toBeTruthy();
  });

});
