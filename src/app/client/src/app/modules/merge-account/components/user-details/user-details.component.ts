import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import {MergeAccountService} from '../../services/merge-account.service';
import {UserService} from '../../../core/services';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  form: FormGroup;
  disableFormSubmit = true;


  constructor(public formBuilder: FormBuilder, public mergeAccountService: MergeAccountService,
              public userService: UserService) {
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      identifier: new FormControl(null, [Validators.required, Validators.pattern(/^([6-9]\d{9}|\w+@\w+\.\w{2,3})$/)]),
      password: new FormControl(null, [Validators.required])
    });

    /* this.form.valueChanges.subscribe(val => {
      this.nameNotExist = false;
      if (this.form.status === 'VALID') {
        this.disableFormSubmit = false;
      } else {
        this.disableFormSubmit = true;
      }
    }); */
  }

  validateUserCredentials() {
    const request = {
      identifier: this.form.value.identifier,
      password: this.form.value.password
    };
    console.log('here');
    /*
        this.mergeAccountService.validateUserCredentials(request).subscribe(response => {
          console.log('user validated');
        }, error => {
          console.log('user information invalid');
        });
    */
  }
}
