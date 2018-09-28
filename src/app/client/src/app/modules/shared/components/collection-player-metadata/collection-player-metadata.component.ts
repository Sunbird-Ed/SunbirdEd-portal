import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ResourceService } from './../../services';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-collection-player-metadata',
  templateUrl: './collection-player-metadata.component.html',
  styleUrls: ['./collection-player-metadata.component.css']
})
export class CollectionPlayerMetadataComponent implements OnInit {
  @Input() metaData: any;
  public collectionMeta: any = {};
  public collectionId: string;
  contributions: string;
  contributionsLength: number;
  showContentCreditsModal: boolean;
  contentCreditsData: any = {};

  constructor(public resourceService: ResourceService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.collectionId = params.collectionId;
    });
  }

  showContentCredits () {
    const contentCredits = _.get(this.metaData, 'content-credits');
    this.contentCreditsData = {contributors: '', creators: ''};
    if (contentCredits && contentCredits.length) {
      this.contentCreditsData.contributors = _.map(contentCredits, 'name').toString();
    }
    if (this.metaData && this.metaData.owner) {
      this.contentCreditsData.contributors += this.metaData.owner;
    }
    if (this.metaData && this.metaData.creator) {
      this.contentCreditsData.creators = this.metaData.creator;
    }
    this.showContentCreditsModal = true;
  }

}
