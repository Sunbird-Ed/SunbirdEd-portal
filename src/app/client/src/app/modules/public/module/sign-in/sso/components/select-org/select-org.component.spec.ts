import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOrgComponent } from './select-org.component';

describe('SelectOrgComponent', () => {
  let component: SelectOrgComponent;
  let fixture: ComponentFixture<SelectOrgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectOrgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
