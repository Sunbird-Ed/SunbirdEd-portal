import { SharedModule } from '@sunbird/shared';
import { SearchService, ConceptPickerService, UserService, LearnerService, ContentService } from '@sunbird/core';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConceptPickerComponent } from './concept-picker.component';

describe('ConceptPickerComponent', () => {
  let component: ConceptPickerComponent;
  let fixture: ComponentFixture<ConceptPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), FormsModule, HttpClientTestingModule],
      declarations: [ ConceptPickerComponent ],
      providers: [SearchService, ConceptPickerService, UserService, LearnerService, ContentService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.conceptDataSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.conceptDataSubscription.unsubscribe).toHaveBeenCalled();
  });
});
