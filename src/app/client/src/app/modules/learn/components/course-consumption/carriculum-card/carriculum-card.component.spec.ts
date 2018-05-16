import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarriculumCardComponent } from './carriculum-card.component';

describe('CarriculumCardComponent', () => {
  let component: CarriculumCardComponent;
  let fixture: ComponentFixture<CarriculumCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarriculumCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarriculumCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
