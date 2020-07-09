import { ResourceService } from '@sunbird/shared';
import { Component, Output, EventEmitter } from '@angular/core';
import { TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-explore-ftu-popup',
  templateUrl: './explore-ftu-popup.component.html',
  styleUrls: ['./explore-ftu-popup.component.scss']
})
export class ExploreFtuPopupComponent {
  @Output() close = new EventEmitter();
  constructor(public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute,
    private telemetryService: TelemetryService) { }

  userVisited() {
    if (!localStorage.getItem('anonymous_ftu_groups')) {
      localStorage.setItem('anonymous_ftu_groups', 'anonymous_user');
    }
    this.close.emit();
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
