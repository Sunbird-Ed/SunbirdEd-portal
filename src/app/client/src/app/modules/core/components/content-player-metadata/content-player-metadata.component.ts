import { ConceptPickerService } from './../../services';
import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { ContentData, ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-content-player-metadata',
  templateUrl: './content-player-metadata.component.html',
  styleUrls: ['./content-player-metadata.component.css']
})
export class ContentPlayerMetadataComponent implements OnInit {
  readMore = false;
  contentDataCopy: any;
  contentFieldData: any;
  fieldData = [];
  conceptNames: any;
  filteredConcepts: any;

  @Input() contentData: ContentData;
  constructor(public resourceService: ResourceService, public conceptPickerService: ConceptPickerService) { }

  ngOnInit() {
    console.log(this.contentData);
    this.contentDataCopy = {...this.contentData};
    this.validateContent();
    this.getConceptsNames();
  }

  validateContent() {
    this.fieldData = ['language', 'gradeLevel', 'subject', 'flagReasons', 'flaggedBy', 'flags', 'keywords', 'resourceTypes'];
    _.forEach(this.contentDataCopy, (value, key) => {
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
  getConceptsNames() {
  this.conceptPickerService.conceptData$.subscribe(data => {
      if ( data  && !data.err ) {
        const conceptsData = this.conceptPickerService.concepts;
        this.conceptNames = _.map(this.contentDataCopy.concepts, 'name');
        if (this.conceptNames.length < this.contentDataCopy.concepts.length) {
          this.filteredConcepts = _.filter(conceptsData, (p) => {
            return _.includes(this.contentDataCopy.concepts, p.identifier);
          });
          this.conceptNames = _.map(this.filteredConcepts, 'name');
        }
        this.contentDataCopy.concepts =  this.conceptNames.join(', ');
      }
    });
  }
}



