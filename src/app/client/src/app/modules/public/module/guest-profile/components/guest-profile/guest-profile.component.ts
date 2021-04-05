import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutService } from '../../../../../shared/services/layoutconfig/layout.service';
import { IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-guest-profile',
  templateUrl: './guest-profile.component.html',
  styleUrls: ['./guest-profile.component.scss']
})
export class GuestProfileComponent implements OnInit {
  avatarStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #fff',
    boxShadow: '0 0 6px 0 rgba(0,0,0,0.38)',
    borderRadius: '50%',
    color: '#9017FF',
    fontWeight: '700',
    fontFamily: 'inherit'
  };
  userName = 'Guest User';
  layoutConfiguration: any;
  showEdit = false;
  showEditUserDetailsPopup = false;

  editProfileInteractEdata: IInteractEventEdata;
  public unsubscribe$ = new Subject<void>();
  constructor(
    public resourceService: ResourceService,
    public layoutService: LayoutService
  ) { }

  ngOnInit() {
    this.initLayout();
    this.setInteractEventData();
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      /* istanbul ignore else */
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }

  setInteractEventData() {
    this.editProfileInteractEdata = {
      id: 'guest-profile-edit',
      type: 'click',
      pageid: 'guest-profile-read'
    };
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
