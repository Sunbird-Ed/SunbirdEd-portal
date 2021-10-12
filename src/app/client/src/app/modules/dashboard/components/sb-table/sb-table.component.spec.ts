import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbTableComponent } from './sb-table.component';

describe('SbTableComponent', () => {
  let component: SbTableComponent;
  let fixture: ComponentFixture<SbTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
