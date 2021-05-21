import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramDatasetsComponent } from './program-datasets.component';

describe('ProgramDatasetsComponent', () => {
  let component: ProgramDatasetsComponent;
  let fixture: ComponentFixture<ProgramDatasetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramDatasetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramDatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
