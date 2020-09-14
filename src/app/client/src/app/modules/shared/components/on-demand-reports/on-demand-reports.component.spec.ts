import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnDemandReportsComponent } from './on-demand-reports.component';

describe('OnDemandReportsComponent', () => {
  let component: OnDemandReportsComponent;
  let fixture: ComponentFixture<OnDemandReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnDemandReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnDemandReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
