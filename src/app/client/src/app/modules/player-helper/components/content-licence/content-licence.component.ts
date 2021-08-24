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
  expanded: boolean = false;
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);

    if (this.content && _.get(this.content, 'attributions')) {
      // attributors
      const attributions = _.isString(_.get(this.content, 'attributions')) ?
        _.get(this.content, 'attributions').split(',') : _.get(this.content, 'attributions');

      this.attributions = (_.compact(_.uniq(attributions).sort()).join(', '));
    }
  }

}
