import { TelemetryService } from '@sunbird/telemetry';
import { ResourceService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss']
})
export class ProfileDropdownComponent implements OnInit {

  instance: string;

  constructor(public resourceService: ResourceService,
    public activatedRoute: ActivatedRoute,
    public telemetryService: TelemetryService) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
  }

  setTelemetry() {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute, 'root.firstChild.snapshot.data.telemetry.env'),
        cdata: []
      },
      edata: {
        id: 'about-us',
        type: 'click',
        pageid: _.get(this.activatedRoute, 'root.firstChild.snapshot.data.telemetry.pageid') || 'library'
      }
    };
    this.telemetryService.interact(interactData);
  }
}
