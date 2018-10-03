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

  constructor(public resourceService: ResourceService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.collectionId = params.collectionId;
    });
  }

  showContentCreditsPopup () {
    this.showContentCreditsModal = true;
  }

}
