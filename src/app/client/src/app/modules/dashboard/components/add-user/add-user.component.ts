import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ConfigService, IUserData, LayoutService, NavigationHelperService, ResourceService, ServerResponse, ToasterService, UtilService, ConnectionService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { UserService, TncService } from '@sunbird/core';
import { first, takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { FormService } from '../../../../modules/core/services/form/form.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {
  provinceList: { label: string; value: string }[] = [];
  trainingGroupList: any[] = [];
  isLoadingTrainingGroups = false;
  isSubmitting: boolean;
  instance: string;
  layoutConfiguration: any;
  public unsubscribe$ = new Subject<void>();

  constructor(private formService: FormService, private fb: FormBuilder, public userService: UserService,
    private snackBar: MatSnackBar,public configService: ConfigService,
    public resourceService: ResourceService,public layoutService: LayoutService,
  ) { }

  rolesList = ['Public', 'Content Creator', 'Content Reviewer'];
  userForm!: FormGroup;
  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[A-Za-z]+$')]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[A-Za-z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      roles: [[], Validators.required],
      province: ['', Validators.required],
      cin: ['', [Validators.required]],
      trainingGroups: ['', Validators.required],
      category: ['', Validators.required],
      idFmps: ['', Validators.required],
      description: ['', [Validators.maxLength(500)]],
      userType: ['normal', Validators.required]
    })
    this.userForm.get('userType')?.valueChanges.subscribe((userType) => {
      const passwordControl = this.userForm.get('password');
    
      if (userType === 'sso') {
        passwordControl?.clearValidators();          
        passwordControl?.setValue('');               
      } else {
        passwordControl?.setValidators([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};\':"\\|,.<>/?]).{8,}$')
        ]);
      }
      passwordControl?.updateValueAndValidity();     
    });
    
    this.fetchAllTrainingGroups();

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

  private fetchAllTrainingGroups(): void {
    this.isLoadingTrainingGroups = true;

    this.userService.getAllTrainingGroups().subscribe({
      next: (data) => {
        this.trainingGroupList = data.map((item: any) => ({
          code: item.code,
        }));
        this.isLoadingTrainingGroups = false;
      },
      error: (err) => {
        console.error('Failed to load training groups:', err);
        this.isLoadingTrainingGroups = false;
      }
    });
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
          ...(formData.userType !== 'sso' ? { password: formData.password } : {}),
          roles: formData.roles.map((role: string) => role.toUpperCase()),
          description: formData.description || '',
          framework: {
            category: [],
            id: ['FMPS'],
            language: ['English', 'French'],
            organisation: ['FMPS'],
            profileConfig: [
              JSON.stringify({
                category: formData.category || '',
                trainingGroup: formData.trainingGroups || '',
                cin: formData.cin || '',
                idFmps: formData.idFmps || '',
                province: formData.province || ''
              })
            ]
          }
        }
      };

      const isSso = formData.userType === 'sso';

      this.userService.createUserWithType(payload, isSso).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.snackBar.open(isSso ? 'SSO User created successfully!' : 'User created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snack-success'],
          });
          this.userForm.reset();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.snackBar.open(
            err?.error?.params?.errmsg || (isSso ? 'SSO user creation failed' : 'User creation failed'),
            'Close',
            {
              duration: 3000,
              panelClass: ['snack-error'],
            }
          );
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(); 
    this.unsubscribe$.complete();
  }
}
