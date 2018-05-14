import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PlayerService } from './../../services';

@Component({
  selector: 'app-collection-player-metadata',
  templateUrl: './collection-player-metadata.component.html',
  styleUrls: ['./collection-player-metadata.component.css']
})
export class CollectionPlayerMetadataComponent implements OnInit {
  public collectionMeta: any = {};
  public collectionId: string;
  constructor(public resourceService: ResourceService, private activatedRoute: ActivatedRoute,
    public playerService: PlayerService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.collectionId = params.collectionId;
    });
    this.playerService.getCollectionHierarchy(this.collectionId).subscribe(response => {
      this.collectionMeta = response.result.content;
    });
  }
}
