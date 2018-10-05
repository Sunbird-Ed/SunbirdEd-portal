import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCourseBatchComponent } from './view-course-batch.component';
import { FormsModule, NgForm, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
describe('ViewCourseBatchComponent', () => {
  let component: ViewCourseBatchComponent;
  let fixture: ComponentFixture<ViewCourseBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCourseBatchComponent ],
      imports: [SuiModule, FormsModule, ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCourseBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

});
