import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { ContentData } from '@sunbird/shared';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

@Component({
  selector: 'app-collection-player-metadata',
  templateUrl: './collection-player-metadata.component.html',
  styleUrls: ['./collection-player-metadata.component.scss']
})
export class CollectionPlayerMetadataComponent implements OnInit {
  @Input() metaData: ContentData;
  instance: string;
  public collectionMeta: any = {};
  public collectionId: string;
  contributions: string;
  contributionsLength: number;
  showContentCreditsModal: boolean;
  frameworkCategoriesList;

  constructor(public resourceService: ResourceService, private activatedRoute: ActivatedRoute, public cslFrameworkService: CslFrameworkService) { }

  ngOnInit() {
    this.frameworkCategoriesList = this.cslFrameworkService.getAllFwCatName();
    this.instance = _.upperCase(this.resourceService.instance);
    this.activatedRoute.params.subscribe((params) => {
      this.collectionId = params.collectionId;
    });
  }

  showContentCreditsPopup () {
    this.showContentCreditsModal = true;
  }

  getTelemetryInteractEdata = ({id, type = 'click'}) => ({id, type, pageid: 'collection-player'});

  getTelemetryInteractObject() {
    return {
      id: this.collectionId,
      type: _.get(this.metaData, 'contentType'),
      ver: this.metaData.pkgVersion ? this.metaData.pkgVersion.toString() : '1.0'
    };
  }

}
