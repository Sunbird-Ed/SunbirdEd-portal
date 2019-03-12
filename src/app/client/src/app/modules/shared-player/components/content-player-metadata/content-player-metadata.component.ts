import { Subscription } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { ContentData, ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-content-player-metadata',
  templateUrl: './content-player-metadata.component.html',
  styleUrls: ['./content-player-metadata.component.scss']
})
export class ContentPlayerMetadataComponent implements OnInit {
  readMore = false;
  metadata: any;
  contentFieldData: any;
  fieldData = [];
  conceptNames: any;
  filteredConcepts: any;
  conceptDataSubscription: Subscription;
  showContentCreditsModal: boolean;

  @Input() contentData: ContentData;
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    this.metadata = { ...this.contentData };
    this.validateContent();
  }

  validateContent() {
    this.fieldData = ['language', 'gradeLevel', 'subject', 'flagReasons', 'flaggedBy', 'flags', 'keywords',
      'resourceTypes', 'attributions'];
    _.forEach(this.metadata, (value, key) => {
      if (_.compact(key) && _.includes(this.fieldData, key)) {
        if (_.isString(value)) {
          this.contentFieldData = [value];
          this.metadata[key] = (_.isArray(this.contentFieldData)) ? (_.compact(this.contentFieldData).join(', ')) : '';
        } else {
          this.metadata[key] = (_.isArray(value)) ? (_.compact(value).join(', ')) : '';
        }
      }
    });
  }

  showContentCreditsPopup () {
    this.showContentCreditsModal = true;
  }

}



