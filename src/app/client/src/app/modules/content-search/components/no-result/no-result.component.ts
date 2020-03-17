import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-no-result-found',
  templateUrl: './no-result.component.html',
  styleUrls: ['./no-result.component.scss']
})
export class NoResultComponent implements OnInit {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() buttonText: string;
  @Input() showExploreContentButton: boolean;
  @Input() filters;
  @Input() telemetryInteractEdataObject;
  @Output() exploreMoreContent = new EventEmitter();
  instance: string;
  exploreMoreContentEdata: IInteractEventEdata;

  constructor( public router: Router, public resourceService: ResourceService  ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.exploreMoreContentEdata = {
      ...this.telemetryInteractEdataObject,
      extra : {
      ...this.filters
      }
    };
  }

  handleEvent() {
    this.exploreMoreContent.emit();
  }

}
