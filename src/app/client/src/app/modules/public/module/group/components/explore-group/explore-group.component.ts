import { MY_GROUPS } from '../routerLinks';
import { Component, OnInit } from '@angular/core';
import { ResourceService, NavigationHelperService } from '@sunbird/shared';
import { TelemetryService, IImpressionEventInput } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-explore-group',
  templateUrl: './explore-group.component.html',
  styleUrls: ['./explore-group.component.scss']
})
export class ExploreGroupComponent implements OnInit {
  showWelcomePopup = true;
  telemetryImpression: IImpressionEventInput;

  constructor(public resourceService: ResourceService, private activatedRoute: ActivatedRoute,
    private telemetryService: TelemetryService, private router: Router, private navigationhelperService: NavigationHelperService) { }

  redirectTologin() {
    window.location.href = MY_GROUPS;
  }

  showFtuPopup(visibility: boolean = false) {
    this.showWelcomePopup = visibility;
  }

  ngOnInit() {
    this.showWelcomePopup = !localStorage.getItem('anonymous_ftu_groups');
    this.telemetryImpression = {
      context: {
        env: _.get(this.activatedRoute, 'snapshot.data.telemetry.env')
      },
      edata: {
        type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
        pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid'),
        subtype: _.get(this.activatedRoute, 'snapshot.data.telemetry.subtype'),
        uri: this.router.url,
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
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
    };
    this.telemetryService.interact(interactData);
  }

}
