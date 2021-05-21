import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { ContentData } from '@sunbird/shared';

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

  constructor(public resourceService: ResourceService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
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
