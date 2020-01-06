import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import {ContentDetails} from './content-metadata.component.interface';
@Component({
  selector: 'app-content-metadata',
  templateUrl: './content-metadata.component.html',
  styleUrls: ['./content-metadata.component.scss']
})
export class ContentMetadataComponent implements OnInit {
  instance: string;
  @Input() contentData: ContentDetails;
  constructor(public resourceService: ResourceService) { }
  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
  }

}
