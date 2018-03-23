import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrgTypeComponent } from './view-org-type.component';

describe('ViewOrgTypeComponent', () => {
  let component: ViewOrgTypeComponent;
  let fixture: ComponentFixture<ViewOrgTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOrgTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOrgTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
