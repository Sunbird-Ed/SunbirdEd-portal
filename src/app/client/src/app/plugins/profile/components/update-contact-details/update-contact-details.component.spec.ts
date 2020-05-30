import { UpdateContactDetailsComponent } from './update-contact-details.component';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from './../../services';

describe('UpdateContactDetailsComponent', () => {
  let component: UpdateContactDetailsComponent;
  let fixture: ComponentFixture<UpdateContactDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, FormsModule, ReactiveFormsModule,
        HttpClientTestingModule, SuiModule, TelemetryModule.forRoot()],
      declarations: [UpdateContactDetailsComponent],
      providers: [ResourceService, ProfileService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateContactDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should show validation error message for form', () => {
    component.contactType = 'phone';
    spyOn(component, 'onContactValueChange');
    spyOn(component, 'enableSubmitButton');
    component.ngOnInit();
    expect(component.contactTypeForm.valid).toBeFalsy();
    expect(component.onContactValueChange).toHaveBeenCalled();
    expect(component.enableSubmitButton).toHaveBeenCalled();
    expect(component.enableSubmitBtn).toBeFalsy();
  });
  it('should show validation error message for email', () => {
    component.contactType = 'email';
    spyOn(component, 'onContactValueChange');
    spyOn(component, 'enableSubmitButton');
    component.ngOnInit();
    let errors = {};
    const email = component.contactTypeForm.controls['email'];
    email.setValue('');
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(component.onContactValueChange).toHaveBeenCalled();
    expect(component.enableSubmitButton).toHaveBeenCalled();
    expect(component.enableSubmitBtn).toBeFalsy();
  });
  it('should show validation error message for phone', () => {
    component.contactType = 'phone';
    spyOn(component, 'onContactValueChange');
    spyOn(component, 'enableSubmitButton');
    component.ngOnInit();
    let errors = {};
    const phone = component.contactTypeForm.controls['phone'];
    phone.setValue('');
    errors = phone.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(component.onContactValueChange).toHaveBeenCalled();
    expect(component.enableSubmitButton).toHaveBeenCalled();
    expect(component.enableSubmitBtn).toBeFalsy();
  });
  it('should show pattern match error message for phone', () => {
    component.contactType = 'phone';
    spyOn(component, 'onContactValueChange');
    spyOn(component, 'enableSubmitButton');
    component.ngOnInit();
    let errors = {};
    const phone = component.contactTypeForm.controls['phone'];
    phone.setValue('8989');
    errors = phone.errors || {};
    expect(errors['pattern']).toBeTruthy();
    expect(component.onContactValueChange).toHaveBeenCalled();
    expect(component.enableSubmitButton).toHaveBeenCalled();
    expect(component.enableSubmitBtn).toBeFalsy();
  });
  it('should call onContactValueChange method', () => {
    component.contactType = 'email';
    spyOn(component, 'onContactValueChange');
    spyOn(component, 'enableSubmitButton');
    component.ngOnInit();
    expect(component.onContactValueChange).toHaveBeenCalled();
    expect(component.enableSubmitBtn).toBeFalsy();
    expect(component.enableSubmitButton).toHaveBeenCalled();
  });
  it('set values with enabling the submit button ', () => {
    component.contactType = 'email';
    component.ngOnInit();
    const email = component.contactTypeForm.controls['email'];
    email.setValue('abc@gmail.com');
    const uniqueContact = component.contactTypeForm.controls['uniqueContact'];
    uniqueContact.setValue(true);
    expect(component.enableSubmitBtn).toBeTruthy();
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.contactType = 'phone';
    component.ngOnInit();
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });
});
