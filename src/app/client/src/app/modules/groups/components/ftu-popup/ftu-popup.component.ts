import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { GroupsService } from '../../services';
@Component({
  selector: 'app-ftu-popup',
  templateUrl: './ftu-popup.component.html',
  styleUrls: ['./ftu-popup.component.scss']
})
export class FtuPopupComponent implements OnInit {

  slideConfig1 = {};
  instance;

  @Input() showWelcomePopup;
  @Input()showMemberPopup;
  @Output() close = new EventEmitter();

  constructor(public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupsService) { }



  ngOnInit() {
    this.instance = this.resourceService.instance;
    this.slideConfig1 = {
      // 'lazyLoad': 'progressive',
      'slidesToShow': 1,
      'infinite': false,
      'rtl': false,
      'dots': true,
      'adaptiveHeight': true
      // 'fade': true,
      // 'cssEase': 'linear',
      // 'autoplay': true,
      // 'autoplaySpeed': 2000
    };
  }

  closeModal() {
    this.showWelcomePopup = false;
    this.close.emit(true);
  }

  closeMemberPopup() {
    this.showMemberPopup = false;
    this.close.emit(true);
    localStorage.setItem('login_members_ftu', 'members');
  }

  addTelemetry (id) {
    const groupId = _.get(this.activatedRoute.snapshot, 'params.groupId');
    const cdata = groupId ? [{id: groupId, type : 'group'}] : [];
    this.groupService.addTelemetry({id}, this.activatedRoute.snapshot, cdata);
  }


}
