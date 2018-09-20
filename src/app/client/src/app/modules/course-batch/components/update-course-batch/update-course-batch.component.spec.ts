import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCourseBatchComponent } from './update-course-batch.component';
import {
  FormsModule, NgForm, FormBuilder, Validators, FormGroup, ReactiveFormsModule
} from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';

describe('UpdateCourseBatchComponent', () => {
  let component: UpdateCourseBatchComponent;
  let fixture: ComponentFixture<UpdateCourseBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateCourseBatchComponent],
      imports: [SuiModule, FormsModule, ReactiveFormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCourseBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

