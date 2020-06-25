import { MY_GROUPS } from './../routerLinks';
import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourceService, ToasterService, IUserProfile } from '@sunbird/shared';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupsService } from '../../services';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit, OnDestroy {
  @ViewChild('createGroupModal') createGroupModal;
  @Output() closeEvent = new EventEmitter<any>();
  @Output() submitForm = new EventEmitter<any>();
  groupForm: FormGroup;
  public formFieldOptions = [];
  public selectedOption: any = {};
  private unsubscribe: Subscription;
  submitInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  telemetryImpression: IImpressionEventInput;
  public userProfile: IUserProfile;
  public editMode: boolean;

  constructor(public resourceService: ResourceService, private toasterService: ToasterService,
    private fb: FormBuilder, public groupService: GroupsService, private route: Router) { }

  ngOnInit() {
    this.initializeForm();
  }
  private initializeForm() {
    this.groupForm = this.fb.group({
      groupName: ['', [
        Validators.required,
      ]],
      groupDescription: ['', [
      ]],
      groupToc: ['', [Validators.requiredTrue]]
    });
  }

  async onSubmitForm() {
    if (this.groupForm.valid) {
      const group = await this.groupService.createGroup(this.groupForm.value);
      if (group) {
        this.toasterService.success('Group created successfully');
        this.submitForm.emit(group);
      }
    } else {
      Object.keys(this.groupForm.controls).forEach(field => {
        const control = this.groupForm.get(field);

        control.markAsTouched({ onlySelf: true });
      });
    }
    this.closeModal();
  }

  closeModal() {
    this.close();
    this.route.navigate(['my-groups']);
  }

  close() {
    if (this.createGroupModal && this.createGroupModal.deny) {
      this.createGroupModal.deny();
    }
  }

  isFieldValid(field: string) {
    return !this.groupForm.get(field).valid && this.groupForm.get(field).touched;
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe.unsubscribe();
    }
    this.close();
  }

}
