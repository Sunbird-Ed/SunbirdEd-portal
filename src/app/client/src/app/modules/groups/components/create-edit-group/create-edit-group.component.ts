import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { GroupsService } from '../../services';
@Component({
  selector: 'app-create-edit-group',
  templateUrl: './create-edit-group.component.html',
  styleUrls: ['./create-edit-group.component.scss']
})
export class CreateEditGroupComponent implements OnInit, OnDestroy {
  @ViewChild('createGroupModal') createGroupModal;
  @Output() closeEvent = new EventEmitter<any>();
  @Output() submitForm = new EventEmitter<any>();
  groupForm: FormGroup;
  public formFieldOptions = [];
  public selectedOption: any = {};
  private unsubscribe: Subscription;
  public editMode: boolean;
  showUpdateForm = false;

  constructor(public resourceService: ResourceService, private toasterService: ToasterService,
    private fb: FormBuilder, public groupService: GroupsService, private navigationHelperService: NavigationHelperService) { }

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

  isFieldValid(field: string) {
    return !this.groupForm.get(field).valid && this.groupForm.get(field).touched;
  }

  onSubmitForm() {
    if (this.groupForm.valid) {
      this.groupService.createGroup(this.groupForm.value).subscribe(group => {
        if (group) {
          this.toasterService.success(this.resourceService.messages.smsg.m001);
          this.submitForm.emit(group);
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

  updateForm() {}

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
