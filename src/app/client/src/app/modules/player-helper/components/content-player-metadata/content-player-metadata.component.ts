import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash-es';
import { ContentData, ResourceService } from '@sunbird/shared';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

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
  public frameworkCategoriesList;
  public transformMetadata;
  public frameworkCategories;
  @Input() contentData: ContentData;
  constructor(public resourceService: ResourceService, public cslFrameworkService: CslFrameworkService) { }

  ngOnInit() {
    this.metadata = { ...this.contentData };
    this.frameworkCategoriesList = this.cslFrameworkService.getGlobalFilterCategoriesObject();
    this.transformMetadata = this.cslFrameworkService.transformContentDataFwBased(this.frameworkCategoriesList,this.metadata);
    this.frameworkCategories = this.cslFrameworkService.getAllFwCatName();
    this.validateContent();
    this.instance = _.upperCase(this.resourceService.instance);
  }

  validateContent() {
    this.fieldData = ['language', this.frameworkCategories[2], this.frameworkCategories[3], 'flagReasons', 'flaggedBy', 'flags', 'keywords',
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

}



