import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllProgramsComponent } from './list-all-programs.component';

describe('ListAllProgramsComponent', () => {
  let component: ListAllProgramsComponent;
  let fixture: ComponentFixture<ListAllProgramsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAllProgramsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
