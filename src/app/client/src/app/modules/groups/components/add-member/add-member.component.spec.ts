import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { AddMemberComponent } from './add-member.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AddMemberComponent', () => {
  let component: AddMemberComponent;
  let fixture: ComponentFixture<AddMemberComponent>;
  configureTestSuite();
  const resourceBundle = {
    instance: 'DEV'
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemberComponent ],
      imports: [SharedModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: ResourceService, useValue: resourceBundle }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.instance).toEqual('DEV');
  });
});
