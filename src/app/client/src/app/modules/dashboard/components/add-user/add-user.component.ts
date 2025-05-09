import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ConfigService, IUserData, LayoutService, NavigationHelperService, ResourceService, ServerResponse, ToasterService, UtilService, ConnectionService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { UserService, TncService } from '@sunbird/core';
import { first, takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublicDataService } from '../../../../../../../../../src/app/client/src/app/modules/core/services/public-data/public-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormService } from '../../../../modules/core/services/form/form.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  provinceList: { label: string; value: string }[] = [];
  isSubmitting: boolean;
  instance: string;
  layoutConfiguration: any;
  public unsubscribe$ = new Subject<void>();

  constructor(private formService: FormService, private fb: FormBuilder, public userService: UserService,
    private snackBar: MatSnackBar,public publicDataService: PublicDataService,public configService: ConfigService,
    public resourceService: ResourceService,public layoutService: LayoutService,
  ) { }

  rolesList = ['Public', 'Content Creater', 'Content Reviewer'];
  userForm!: FormGroup;
  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[A-Za-z]+$')]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[A-Za-z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      roles: [[], Validators.required],
      nationalId: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]{6,20}$')]],
      description: ['', [Validators.maxLength(250)]],
      province: ['', Validators.required]
    });
    const formParams = {
      formType: 'profileConfig_v2',
      formAction: 'get',
      contentType: 'default'
    };
    this.formService.getFormConfig(formParams, '01429195271738982411', 'data.fields')
      .subscribe({
        next: (fields) => {
          const provinceField = fields.find(f => f.code === 'province');
          this.provinceList = provinceField?.templateOptions?.options || [];
        },
        error: (err) => {
          console.error('Failed to load provinces:', err);
        }
      });
    this.initLayout();
    this.instance = _.upperFirst(_.toLower(this.resourceService.instance || 'SUNBIRD'));
  }

  goBack() {
    window.history.back();
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.userForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const formData = this.userForm.value;

      const payload = {
        request: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: 'Fmps@1234',
          roles: formData.roles.map((role: string) => role.toUpperCase()),
          nationalId: formData.nationalId || '',
          description: formData.description || '',
          framework: {
            category: [],
            id: ['FMPS'],
            language: ['English', 'French'],
            organisation: ['FMPS'],
            profileConfig: [
              JSON.stringify({
                category: formData.category || '',
                trainingGroup: formData.trainingGroup || '',
                cin: formData.cin || '',
                idFmps: formData.idFmps || '',
                province: formData.province || ''
              })
            ]
          }
        }
      };
      this.userService.createUser(payload).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.snackBar.open('User created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snack-success']
          });
          this.userForm.reset();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.snackBar.open(err?.error?.params?.errmsg || 'User creation failed', 'Close', {
            duration: 3000,
            panelClass: ['snack-error']
          });
        }
      });
    }
  }
}
