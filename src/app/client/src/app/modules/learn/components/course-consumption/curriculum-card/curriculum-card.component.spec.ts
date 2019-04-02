import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CurriculumCardComponent } from './curriculum-card.component';
import {SharedModule} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('CurriculumCardComponent', () => {
  let component: CurriculumCardComponent;
  let fixture: ComponentFixture<CurriculumCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      declarations: [ CurriculumCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurriculumCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
