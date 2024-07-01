import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { GroupsService } from '../../services';
import * as _ from 'lodash-es';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { NavigationHelperService } from '@sunbird/shared';
import { POPUP_LOADED, CREATE_GROUP, SELECT_CLOSE, CLOSE_ICON, SELECT_RESET } from '../../interfaces/telemetryConstants';
import { UtilService } from '../../../shared/services/util/util.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-create-edit-group',
  templateUrl: './create-edit-group.component.html',
  styleUrls: ['./create-edit-group.component.scss']
})
export class CreateEditGroupComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('createGroupModal') createGroupModal;
  groupForm: UntypedFormGroup;
  groupDetails: {};
  groupId: string;
  url = document.location.origin;
  instance: string;
  disableBtn = false;
  isDesktopApp = false;
  private unsubscribe$ = new Subject<void>();
  public telemetryImpression: IImpressionEventInput;
  public SELECT_CLOSE = SELECT_CLOSE;
  public CLOSE_ICON = CLOSE_ICON;
  public SELECT_RESET = SELECT_RESET;

  constructor(public resourceService: ResourceService,
    private toasterService: ToasterService,
    private fb: UntypedFormBuilder,
    public groupService: GroupsService,
    private activatedRoute: ActivatedRoute,
    private telemetryService: TelemetryService,
    public router: Router,
    public navigationHelperService: NavigationHelperService,
    public utilService: UtilService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.isDesktopApp = this.utilService.isDesktopApp;
    this.groupId = _.get(this.activatedRoute, 'parent.snapshot.params.groupId');
    this.groupId ? (this.groupService.groupData ? (this.groupDetails = this.groupService.groupData) :
      this.groupService.goBack()) : this.groupDetails = {};
    this.initializeForm();

    if (this.isDesktopApp) {
      this.url = this.utilService.getAppBaseUrl();
    }
  }

  /**
   * @description - It will trigger impression telemetry event once the view is ready.
   */
  ngAfterViewInit() {
    if (!this.groupId) {
      this.setTelemetryImpression({ type: POPUP_LOADED });
    }
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
    if (this.groupId) { this.groupForm.patchValue({ groupToc: true }); }

    if (field === 'name') {
      this.groupForm.patchValue({ name: _.trimStart(this.groupForm.get(field).value), });
    }
    return !this.groupForm.get(field).valid && this.groupForm.get(field).dirty;
  }

  onSubmitForm({ modalId }) {
    this.disableBtn = true;
    this.addTelemetry('submit-group-form', '', { type: CREATE_GROUP });
    if (this.groupForm.valid) {
      const request = _.omit(this.groupForm.value, 'groupToc');
      request.name = _.trim(request.name);
      request.description = _.trim(request.description);
      this.groupService.createGroup(request).pipe(takeUntil(this.unsubscribe$)).subscribe(group => {
        if (group) {
          this.toasterService.success(this.resourceService.messages.smsg.grpcreatesuccess);
        }
        this.groupService.emitCloseForm();
        this.disableBtn = false;
        this.closeModal({ modalId });
      }, err => {
        this.disableBtn = false;
        const errCode: string = _.get(err, 'response.body.params.err') || _.get(err, 'params.err');

        if (errCode === 'GS_CRT04') {
          this.toasterService.error(this.resourceService.messages.groups.emsg.m001);
          this.addTelemetry('exceeded-group-max-limit', { group_count: this.groupService.groupListCount });
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m001);
        }

        Object.keys(this.groupForm.controls).forEach(field => {
          const control = this.groupForm.get(field);
          control.markAsTouched({ onlySelf: true });
        });
        this.closeModal({ modalId });
        this.groupService.emitCloseForm();
      });
    } else {
      this.closeModal({ modalId });
    }
  }

  updateGroup({ modalId }) {
    this.disableBtn = true;
    if (this.groupForm.valid && !_.isEmpty(_.trim(this.groupForm.value.name))) {
      const updatedForm = _.omit(this.groupForm.value, 'groupToc');
      updatedForm.name = _.trim(updatedForm.name);
      updatedForm.description = _.trim(updatedForm.description);
      updatedForm.status = _.get(this.groupDetails, 'status');
      this.groupService.updateGroup(this.groupId, updatedForm).pipe(takeUntil(this.unsubscribe$)).subscribe(group => {
        this.toasterService.success(this.resourceService.messages.smsg.m003);
        this.groupService.emitCloseForm();
        this.closeModal({ modalId });
        this.disableBtn = false;

      }, err => {
        this.disableBtn = false;
        this.groupService.emitCloseForm();
        Object.keys(this.groupForm.controls).forEach(field => {
          const control = this.groupForm.get(field);
          control.patchValue({ name: '', description: '' });
          control.markAsTouched({ onlySelf: true });
        });
        this.toasterService.error(this.resourceService.messages.emsg.m005);
        this.closeModal({ modalId });
      });
    } else {
      this.toasterService.error(this.resourceService.messages.emsg.m005);
      this.closeModal({ modalId });
    }
  }

  reset() {
    this.groupForm.reset();
  }

  closeModal({ modalId }) {
    modalId && this.close(modalId);
    this.groupService.goBack();
  }

  close(modalId?: string) {
    const dialogRef = modalId && this.matDialog.getDialogById(modalId);
    dialogRef && dialogRef.close();
  }

  /**
  * @description - To set the telemetry Intract event data
  * @param  {} edata? - it's an object to specify the type and subtype of edata
  */
  addTelemetry(id, extra?, edata?) {
    this.groupService.addTelemetry({ id, extra, edata }, this.activatedRoute.snapshot, [], this.groupId);
  }

  setTelemetryImpression(edata?) {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          type: 'Group',
          id: this.groupId || ''
        }]
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        duration: this.navigationHelperService.getPageLoadTime()
      }
    };
    if (edata) {
      this.telemetryImpression.edata.type = edata.type;
    }
    this.telemetryService.impression(this.telemetryImpression);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
