import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from './../../services';
import { ActivatedRoute } from '@angular/router';
import { ContentData } from '@sunbird/shared';

@Component({
  selector: 'app-collection-player-metadata',
  templateUrl: './collection-player-metadata.component.html',
  styleUrls: ['./collection-player-metadata.component.css']
})
export class CollectionPlayerMetadataComponent implements OnInit {
  @Input() metaData: ContentData;
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
