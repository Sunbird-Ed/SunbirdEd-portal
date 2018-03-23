import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrgTypeComponent } from './create-org-type.component';

describe('CreateOrgTypeComponent', () => {
  let component: CreateOrgTypeComponent;
  let fixture: ComponentFixture<CreateOrgTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrgTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrgTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
