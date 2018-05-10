import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { ContentData, ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-content-player-metadata',
  templateUrl: './content-player-metadata.component.html',
  styleUrls: ['./content-player-metadata.component.css']
})
export class ContentMetadataComponent implements OnInit {
  readMore = false;
  contentDataCopy = {};
  contentFieldData: any;
  fieldData = [];

  @Input() contentData: ContentData;
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    this.validateContent();
  }

  validateContent() {
    this.fieldData = ['language', 'gradeLevel', 'subject', 'flagReasons', 'flaggedBy', 'flags', 'keywords'];
    _.forEach(this.contentData, (value, key) => {
      if (_.compact(key) && _.includes(this.fieldData, key)) {
        if (_.isString(value)) {
          this.contentFieldData = [value];
          this.contentDataCopy[key] = (_.isArray(this.contentFieldData)) ? (_.compact(this.contentFieldData).join(', ')) : '';
        } else {
          this.contentDataCopy[key] = (_.isArray(value)) ? (_.compact(value).join(', ')) : '';
        }
        return this.contentDataCopy;
      }
    });
  }

  /**
   * Fetches concepts
   * @param {any} concepts
   * @returns {string}
   */
  getConceptsNames(concepts): string {
    const conceptNames = _.map(concepts, 'name');
    if (concepts && conceptNames.length < concepts.length) {
      // const filteredConcepts = _.filter($rootScope.concepts, (p) => {
      //   return _.includes(concepts, p.identifier);
      // });
      // conceptNames = _.map(filteredConcepts, 'name');
    }
    return conceptNames.join(', ');
  }

  getResourceTypes(resourceTypes) {
    if (!resourceTypes) {
      return false;
    }
    if (_.isString(resourceTypes)) {
      return resourceTypes;
    } else if (_.isArray(resourceTypes)) {
      return resourceTypes.join(', ')
    } else {
      return false;
    }
  }
}



