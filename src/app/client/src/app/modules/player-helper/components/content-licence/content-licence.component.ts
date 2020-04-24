import { Component, Input, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-content-licence',
  templateUrl: './content-licence.component.html',
  styleUrls: ['./content-licence.component.scss']
})
export class ContentLicenceComponent implements OnInit {

  @Input() content;
  instance: string;
  attributions: string;

  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);

    if (this.content) {

      // contributors , it is a combination of content credits names, creators, and owner
      const contentCredits = _.get(this.content, 'contentCredits');
      const contentCreditNames = contentCredits && contentCredits.length ? _.map(contentCredits, 'name') : [];
      const contributors = this.content['contributors'] ? this.content['contributors'].split(',') : [];

      if (this.content['owner']) {
        contributors.push(this.content['owner']);
      }

      // creators is a combination of creators and creator
      const creators = this.content['creators'] ? this.content['creators'].split(',') : [];

      if (this.content['creator']) {
        creators.push(this.content['creator']);
      }

      // attributors
      const attributions = _.isString(_.get(this.content, 'attributions')) ?
        _.get(this.content, 'attributions').split(',') : _.get(this.content, 'attributions');
      this.attributions = (_.compact(_.uniq(_.union
        (contentCreditNames, contributors, attributions, creators).sort())).join(', '));
    }
  }

}
