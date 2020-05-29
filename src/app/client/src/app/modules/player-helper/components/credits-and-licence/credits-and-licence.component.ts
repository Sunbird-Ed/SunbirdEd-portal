import { Component, Input, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-credits-and-licence',
  templateUrl: './credits-and-licence.component.html',
  styleUrls: ['./credits-and-licence.component.scss']
})
export class CreditsAndLicenceComponent implements OnInit {

  @Input() contentData;
  instance: string;
  attributions: string;

  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);

    if (this.contentData && _.get(this.contentData, 'attributions')) {
      // attributors
      const attributions = _.isString(_.get(this.contentData, 'attributions')) ?
        _.get(this.contentData, 'attributions').split(',') : _.get(this.contentData, 'attributions');
      this.attributions = (_.compact(_.uniq(attributions).sort()).join(', '));
    }
  }

}
