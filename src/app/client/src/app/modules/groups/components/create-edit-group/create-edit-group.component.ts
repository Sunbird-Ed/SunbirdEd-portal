import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
  groupDetails: {};
  groupId: string;
  url = document.location.origin;
  instance: string;
  disableBtn = false;
  private unsubscribe$ = new Subject<void>();

  constructor(public resourceService: ResourceService, private toasterService: ToasterService,
    private fb: FormBuilder, public groupService: GroupsService,
    private activatedRoute: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.groupId = _.get(this.activatedRoute, 'parent.snapshot.params.groupId');
    this.groupId ? (this.groupService.groupData ? (this.groupDetails = this.groupService.groupData) :
    this.groupService.goBack()) : this.groupDetails = {};
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

    if (field === 'name') {
      this.groupForm.patchValue({ name: _.trimStart(this.groupForm.get(field).value), });
    }
    return !this.groupForm.get(field).valid && this.groupForm.get(field).dirty;
  }

  onSubmitForm() {
    this.disableBtn = true;
    this.addTelemetry('submit-group-form');
    if (this.groupForm.valid) {
      const request: IGroup = _.omit(this.groupForm.value, 'groupToc');
      request.name = _.trim(request.name);
      request.description = _.trim(request.description);
      this.groupService.createGroup(request).pipe(takeUntil(this.unsubscribe$)).subscribe(group => {
        if (group) {
          this.toasterService.success(this.resourceService.messages.smsg.m001);
        }
        this.groupService.emitCloseForm();
        this.disableBtn = false;
        this.closeModal();
    }, err => {
        this.disableBtn = false;
        const errMsg: string = _.get(err, 'response.body.params.err') || _.get(err, 'params.err');

        if (errMsg === 'EXCEEDED_GROUP_MAX_LIMIT') {
          this.toasterService.error(this.resourceService.messages.groups.emsg.m001);
          this.addTelemetry('exceeded-group-max-limit', {group_count: this.groupService.groupListCount});
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m001);
        }

        Object.keys(this.groupForm.controls).forEach(field => {
          const control = this.groupForm.get(field);
          control.markAsTouched({ onlySelf: true });
        });
        this.closeModal();
        this.groupService.emitCloseForm();
      });
    } else {
      this.closeModal();
    }
  }

  updateGroup() {
    this.disableBtn = true;
    if (this.groupForm.valid && !_.isEmpty(_.trim(this.groupForm.value.name))) {
      const updatedForm = _.omit(this.groupForm.value, 'groupToc');
      updatedForm.name = _.trim(updatedForm.name);
      updatedForm.description = _.trim(updatedForm.description);
      updatedForm.status = _.get(this.groupDetails, 'status');
      this.groupService.updateGroup(this.groupId, updatedForm).pipe(takeUntil(this.unsubscribe$)).subscribe(group => {
          this.toasterService.success(this.resourceService.messages.smsg.m003);
          this.groupService.emitCloseForm();
          this.closeModal();
          this.disableBtn = false;

      }, err => {
        this.disableBtn = false;
        this.groupService.emitCloseForm();
        Object.keys(this.groupForm.controls).forEach(field => {
          const control = this.groupForm.get(field);
          control.patchValue({name: '', description: ''});
          control.markAsTouched({ onlySelf: true });
        });
        this.toasterService.error(this.resourceService.messages.emsg.m005);
        this.closeModal();
      });
    } else {
      this.toasterService.error(this.resourceService.messages.emsg.m005);
      this.closeModal();
    }
  }

  reset() {
    this.groupForm.reset();
  }

  closeModal() {
    this.close();
    this.groupService.goBack();
  }

  close() {
    if (this.createGroupModal && this.createGroupModal.deny) {
      this.createGroupModal.deny();
    }
  }

  addTelemetry (id, extra?) {
    const cdata = this.groupId ? [{id: this.groupId , type : 'group'}] : [];
    this.groupService.addTelemetry({id, extra}, this.activatedRoute.snapshot, cdata);
  }

  ngOnDestroy() {
    this.close();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
