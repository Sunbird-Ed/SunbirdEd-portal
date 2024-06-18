import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ResourceService } from '../../services';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
})
export class AlertModalComponent {
  isChecked = false;
  instance: string;

  constructor(
    public dialogRef: MatDialogRef<AlertModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private location: Location,
    public resourceService: ResourceService
  ) {
    this.instance = _.upperCase(this.resourceService.instance);
  }


  getMethod(data: any) {
    if (data.type === 'cancel') {
      this.dialogRef.close({ returnValue: data.returnValue, action: 'cancel' });
      return;
    }
    this.dialogRef.close({ returnValue: data.returnValue, action: 'approve' });
  }

  navigatePrevious(data: any) {
    data.footer.buttons[0].returnValue = false;
    this.dialogRef.close({ returnValue: data.footer.buttons[0].returnValue, action: 'deny' });
    this.location.back();
  }
}
