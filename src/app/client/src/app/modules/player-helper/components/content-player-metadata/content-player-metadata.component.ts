import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash-es';
import { ContentData, ResourceService } from '@sunbird/shared';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
import { SearchService } from '@sunbird/core';

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
  public observableElements: any[];
  @Input() contentData: ContentData;
  constructor(public searchService: SearchService,public resourceService: ResourceService, public cslFrameworkService: CslFrameworkService) { }

  ngOnInit() {
     this.searchService.getObservableElements().subscribe(result => {
      this.observableElements = result?.Term || [];
  // Map observableElementIds from metadata (if present) to names once elements are loaded
  this.mapObservableNames();
    });
    this.metadata = { ...this.contentData };
  // Attempt to map observable names in case observableElements were loaded earlier
  this.mapObservableNames();
    this.frameworkCategoriesList = this.cslFrameworkService.getGlobalFilterCategoriesObject();
    this.transformMetadata = this.cslFrameworkService.transformContentDataFwBased(this.frameworkCategoriesList,this.metadata);
    this.frameworkCategories = this.cslFrameworkService.getAllFwCatName();
    this.validateContent();
    this.instance = _.upperCase(this.resourceService.instance);
  }

  /**
   * Map metadata.observableElementIds to friendly names using the observableElements list.
   * Stores result in metadata.observableElementNames as an array of strings.
   */
  private mapObservableNames() {
    if (!this.metadata || !this.metadata.observableElementIds || !this.observableElements || !this.observableElements.length) {
      return;
    }
    try {
      const ids: string[] = Array.isArray(this.metadata.observableElementIds) ? this.metadata.observableElementIds : [];
      const names = ids.map(id => {
        const found = this.observableElements.find((o: any) => o.identifier === id || o.identifier === String(id));
        return found ? found.name : null;
      }).filter((n: any) => !!n);
      // attach to metadata so template can access
      this.metadata.observableElementNames = names;
    } catch (e) {
      // silent fail; don't block rendering
      console.warn('Failed to map observable element names', e);
    }
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



