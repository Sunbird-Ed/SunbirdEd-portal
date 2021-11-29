import { GroupsService } from './../../services';
import { ResourceService } from '@sunbird/shared';
import { acceptTnc, IGroupCard } from './../../interfaces/group';
import { Component, Input, EventEmitter, Output, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import * as _ from 'lodash-es';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationHelperService } from '@sunbird/shared';
import { DELETE_POPUP, POP_DEACTIVATE } from '../../interfaces/telemetryConstants';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-modal',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements AfterViewInit {

  @Input() title: string;
  @Input() msg: string;
  @Input() name: string;

  @Input() type: acceptTnc;

  @Output() handleGroupTnc = new EventEmitter();
  @Output() handleEvent = new EventEmitter();

  channel: string;
  acceptTncType = acceptTnc;
  checked = false;
  url = document.location.origin;
  telemetryImpression: IImpressionEventInput;

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.closeDialog('groupsModal');
    this.closeDialog('groupTncModal');
  }

  constructor(public resourceService: ResourceService,
    private groupService: GroupsService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private telemetryService: TelemetryService,
    public navigationHelperService: NavigationHelperService,
    private matDialog: MatDialog
  ) {
    this.groupService.emitMenuVisibility('activate');
    this.channel = _.upperCase(this.resourceService.instance);
  }

  /**
   * @description - It will trigger impression telemetry event once the view is ready.
   */
  ngAfterViewInit() {
    if (this.name === 'delete') {
      this.setTelemetryImpression({ type: DELETE_POPUP });
    }
    if (this.name === 'deActivate') {
      this.setTelemetryImpression({ type: POP_DEACTIVATE });
    }
  }

  emitEvent(value) {
    this.handleEvent.emit({ name: this.name, action: value });
    this.closeDialog('groupsModal');
  }

  acceptGroupTnc() {
    this.closeDialog('groupTncModal');
    this.handleGroupTnc.emit({ type: this.type });
  }

  closeModal() {
    this.closeDialog('groupTncModal');
    this.handleGroupTnc.emit();
  }

  setTelemetryImpression(edata?) {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          type: 'Group',
          id: _.get(this.groupService, 'groupData.id')
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
  private closeDialog(modalId: string) {
    const dialogRef = this.matDialog.getDialogById(modalId);
    dialogRef && dialogRef.close();
  }
}
