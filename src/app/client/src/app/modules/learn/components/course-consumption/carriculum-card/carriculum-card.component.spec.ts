import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CarriculumCardComponent } from './carriculum-card.component';
import {SharedModule} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('CarriculumCardComponent', () => {
  let component: CarriculumCardComponent;
  let fixture: ComponentFixture<CarriculumCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot()],
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
