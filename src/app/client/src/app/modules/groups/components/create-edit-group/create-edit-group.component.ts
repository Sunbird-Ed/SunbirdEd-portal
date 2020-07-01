import { IGroupMember } from './../../interfaces/group';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { GroupsService } from '../../services';
import * as _ from 'lodash-es';
import { existingMembersList } from '../add-member/add-member.component.spec.data';
@Component({
  selector: 'app-create-edit-group',
  templateUrl: './create-edit-group.component.html',
  styleUrls: ['./create-edit-group.component.scss']
})
export class CreateEditGroupComponent implements OnInit, OnDestroy {
  @ViewChild('createGroupModal') createGroupModal;
  @ViewChild('updateGroupModal') updateGroupModal;
  @Output() closeEvent = new EventEmitter<any>();
  @Output() submitForm = new EventEmitter<any>();
  groupForm: FormGroup;
  public formFieldOptions = [];
  public selectedOption: any = {};
  private unsubscribe: Subscription;
  public editMode: boolean;
  showCreateForm = false;
  showUpdateForm = false;
  groupId;
  currentUser: IGroupMember = existingMembersList[0];

  groupDetails;

  constructor(public resourceService: ResourceService, private toasterService: ToasterService,
    private fb: FormBuilder, public groupService: GroupsService, private navigationHelperService: NavigationHelperService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');
    this.showUpdateForm = !_.isEmpty(this.groupId);
    this.showCreateForm = !this.showUpdateForm;
    this.groupDetails = _.find(this.groupService.groupData, {id: this.groupId});
    this.initializeForm();
  }

  private initializeForm() {
    this.groupForm = this.fb.group({
      name: [_.get(this.groupDetails, 'name') || '', [
        Validators.required,
      ]],
      description: [_.get(this.groupDetails, 'description') || '', [
      ]],
      groupToc: [_.isEmpty(this.groupDetails) ? false : true, [Validators.requiredTrue]]
    });


    console.log('groupFormgroupFormgroupForm', this.groupDetails, this.groupForm);
  }

  isFieldValid(field: string) {
    return !this.groupForm.get(field).valid && this.groupForm.get(field).touched;
  }

  onSubmitForm() {
    if (this.groupForm.valid) {
      const request = _.omit(this.groupForm.value, 'groupToc');
      request.members = [
        { memberId: this.currentUser.identifier, role: 'admin'}
      ];
      this.groupService.createGroup(request).subscribe(group => {
        this.groupService.emitMembersData([this.currentUser]);
        this.toasterService.success(this.resourceService.messages.smsg.m001);
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

  updateForm() {
    if (this.groupForm.valid) {
      const updatedForm = _.omit(this.groupForm.value, 'groupToc');
      this.groupService.updateGroup(this.groupId, updatedForm).subscribe(group => {
          this.toasterService.success('Group Updated successfully');
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

  closeModal() {
    this.close();
    this.navigationHelperService.goBack();
  }


  close() {
    if (this.createGroupModal && this.createGroupModal.deny) {
      this.createGroupModal.deny();
    }
    if (this.updateGroupModal && this.updateGroupModal.deny) {
      this.updateGroupModal.deny();
    }
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe.unsubscribe();
    }
    this.close();
  }

}
