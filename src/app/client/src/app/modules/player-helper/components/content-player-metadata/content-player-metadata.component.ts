import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash-es';
import { ContentData, ResourceService } from '@sunbird/shared';
import { TaxonomyService } from '../../../../service/taxonomy.service';

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
  instance: string;
  // conceptNames: any;
  // filteredConcepts: any;
  showContentCreditsModal: boolean;
  fwCategory = [];

  @Input() contentData: ContentData;
  constructor(public resourceService: ResourceService,  private taxonomyService: TaxonomyService) { }

  ngOnInit() {
    this.metadata = { ...this.contentData };
    this.validateContent();
    this.instance = _.upperCase(this.resourceService.instance);
    this.fwCategory= _.map(this.taxonomyService.getTaxonomyCategories(), category => {return category} );
  }

  validateContent() {
    this.fieldData = ['language', 'gradeLevel', 'subject', 'flagReasons', 'flaggedBy', 'flags', 'keywords',
      'resourceTypes', 'attributions', 'primaryCategory', 'additionalCategories'];
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

  fwCategoryCheck(obj: any, category: string) {
    return this.taxonomyService.getCategoryforHTML(obj, category);
  }
}



