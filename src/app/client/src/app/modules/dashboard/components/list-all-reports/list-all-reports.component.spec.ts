import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllReportsComponent } from './list-all-reports.component';

describe('ListAllReportsComponent', () => {
  let component: ListAllReportsComponent;
  let fixture: ComponentFixture<ListAllReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAllReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
