import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { GroupsService } from '../../services';
import { IGroup } from '../../interfaces';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-create-edit-group',
  templateUrl: './create-edit-group.component.html',
  styleUrls: ['./create-edit-group.component.scss']
})
export class CreateEditGroupComponent implements OnInit, OnDestroy {
  @ViewChild('createGroupModal') createGroupModal;
  groupForm: FormGroup;
  public formFieldOptions = [];
  public selectedOption: any = {};
  private unsubscribe: Subscription;
  groupDetails;
  groupId: string;
  url = document.location.origin;

  constructor(public resourceService: ResourceService, private toasterService: ToasterService,
    private fb: FormBuilder, public groupService: GroupsService, private navigationHelperService: NavigationHelperService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');
    this.groupDetails = this.groupService.groupData;
    this.initializeForm();
  }

  private initializeForm() {
    this.groupForm = this.fb.group({
      name: [_.get(this.groupDetails, 'name') || '', [
        Validators.required,
      ]],
      description: [_.get(this.groupDetails, 'description') || '', [
      ]],
      groupToc: [!_.isEmpty(this.groupDetails), [Validators.requiredTrue]]
    });
  }

  isFieldValid(field: string) {
    if (this.groupId) { this.groupForm.patchValue({groupToc: true}); }
    return !this.groupForm.get(field).valid && this.groupForm.get(field).touched;
  }

  onSubmitForm() {
    if (this.groupForm.valid) {
      const request: IGroup = _.omit(this.groupForm.value, 'groupToc');
      this.groupService.createGroup(request).subscribe(group => {
        if (group) {
          this.toasterService.success(this.resourceService.messages.smsg.m001);
        }
        this.closeModal();
      }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.m001);
        Object.keys(this.groupForm.controls).forEach(field => {
          const control = this.groupForm.get(field);
          control.markAsTouched({ onlySelf: true });
        });
        this.closeModal();
      });
    } else {
      this.closeModal();
    }
  }

  updateGroup() {
    if (this.groupForm.valid) {
      const updatedForm = _.omit(this.groupForm.value, 'groupToc');
      updatedForm.status = _.get(this.groupDetails, 'status');
      this.groupService.updateGroup(this.groupId, updatedForm).subscribe(group => {
          this.toasterService.success(this.resourceService.messages.smsg.m003);
          this.closeModal();
      }, err => {
        Object.keys(this.groupForm.controls).forEach(field => {
          const control = this.groupForm.get(field);
          control.patchValue({name: '', description: ''});
          control.markAsTouched({ onlySelf: true });
        });
        this.toasterService.error(this.resourceService.messages.emsg.m005);
        this.closeModal();
      });
    } else {
      this.closeModal();
    }
  }

  reset() {
    this.groupForm.reset();
  }

  closeModal() {
    this.close();
    this.navigationHelperService.goBack();
  }

  close() {
    if (this.createGroupModal && this.createGroupModal.deny) {
      this.createGroupModal.deny();
    }
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe.unsubscribe();
    }
    this.close();
  }

}
