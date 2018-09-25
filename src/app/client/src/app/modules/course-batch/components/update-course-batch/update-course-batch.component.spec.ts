import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCourseBatchComponent } from './update-course-batch.component';
import {
  FormsModule, NgForm, FormBuilder, Validators, FormGroup, ReactiveFormsModule
} from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import {SharedModule, ResourceService } from '@sunbird/shared';
describe('UpdateCourseBatchComponent', () => {
  let component: UpdateCourseBatchComponent;
  let fixture: ComponentFixture<UpdateCourseBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateCourseBatchComponent],
      imports: [SharedModule.forRoot(), SuiModule, FormsModule, ReactiveFormsModule],
      providers: [ResourceService]
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

