import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
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
    private telemetryService: TelemetryService) { }



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
    const interactData = {
      context: {
        env: _.get(this.activatedRoute, 'snapshot.data.telemetry.env'),
        cdata: []
      },
      edata: {
        id: id,
        type: 'click',
        pageid:  _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid'),
      },
      object: {
        id: _.get(this.activatedRoute, 'snapshot.params.groupId'),
        type: 'Group',
        ver: '1.0',
      }
    };
    this.telemetryService.interact(interactData);
  }

}
