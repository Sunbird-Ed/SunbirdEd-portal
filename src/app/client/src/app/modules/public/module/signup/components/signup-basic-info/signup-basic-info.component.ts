import { Component, EventEmitter, OnInit,Input, Output } from '@angular/core';
import { ResourceService, UtilService, ConfigService } from '@sunbird/shared';
import { Observable } from 'rxjs';
import { TelemetryService } from '@sunbird/telemetry';
import { IStartEventInput, IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-signup-basic-info',
  templateUrl: './signup-basic-info.component.html',
  styleUrls: ['./signup-basic-info.component.scss']
})
export class SignupBasicInfoComponent implements OnInit {

  @Output() subformInitialized: EventEmitter<{}> = new EventEmitter<{}>();
  @Output() triggerNext: EventEmitter<boolean> = new EventEmitter<boolean>();
  public personalInfoForm: FormGroup;
  @Input() isIOSDevice;
  @Input() telemetryImpression;
  @Input() submitInteractEdata;
  @Input() telemetryCdata;
  birthYearOptions: Array<string> = [];
  filteredYOB: Observable<number[]>;
  yearOfBirth: string;
  isMinor: boolean;
  
  constructor(
    public resourceService: ResourceService, public telemetryService: TelemetryService,
    public utilService: UtilService, public configService: ConfigService, private _fb: FormBuilder) { }
  

  ngOnInit(): void {
    this.personalInfoForm = this._fb.group({
      name: ['', Validators.required],
      yearOfBirth: ['', Validators.required]
    })
    this.initiateYearSelecter();
    // @ts-ignore
    this.filteredYOB = this.personalInfoForm.controls.yearOfBirth.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.birthYearOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  next() {
    if(this.personalInfoForm.valid) {
      let userDetails;
      if(localStorage.getItem('guestUserDetails')) {
        userDetails = JSON.parse(localStorage.getItem('guestUserDetails'));
      } else {
        userDetails = {name: this.personalInfoForm.controls.name.value}
      }
      userDetails.name = this.personalInfoForm.controls.name.value;
      localStorage.setItem('guestUserDetails', JSON.stringify(userDetails));
      const signupStage1Details = {
        name: userDetails.name,
        yearOfBirth: this.personalInfoForm.controls.yearOfBirth.value
      }
      this.subformInitialized.emit(signupStage1Details);
      this.triggerNext.emit();
    } else {
      console.log("Invalid form");
    }
  }

  initiateYearSelecter() {
    const endYear = new Date().getFullYear();
    const startYear = endYear - this.configService.constants.SIGN_UP.MAX_YEARS;
    for (let year = endYear; year > startYear; year--) {
      this.birthYearOptions.push(year.toString());
    }
  }

  changeBirthYear(selectedBirthYear) {
    let _selectedYOB = parseInt(_.get(selectedBirthYear, 'option.value'));
    if (this.isIOSDevice) {
      _selectedYOB = parseInt(selectedBirthYear.target.value);
    }
    const currentYear = new Date().getFullYear();
    this.yearOfBirth = `${_selectedYOB}`;
    const userAge = currentYear - _selectedYOB;
    this.isMinor = userAge < this.configService.constants.SIGN_UP.MINIMUN_AGE;
  }

}
