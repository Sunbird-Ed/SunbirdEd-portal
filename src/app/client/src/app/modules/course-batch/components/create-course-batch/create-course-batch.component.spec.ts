import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  FormsModule, NgForm, FormBuilder, Validators, FormGroup, ReactiveFormsModule
} from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { CreateCourseBatchComponent } from './create-course-batch.component';
import {SharedModule, ResourceService} from '@sunbird/shared';
describe('CreateCourseBatchComponent', () => {
  let component: CreateCourseBatchComponent;
  let fixture: ComponentFixture<CreateCourseBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCourseBatchComponent ],
      imports: [SharedModule.forRoot(), SuiModule, FormsModule, ReactiveFormsModule,
      HttpClientTestingModule],
      providers: [ResourceService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCourseBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

});
