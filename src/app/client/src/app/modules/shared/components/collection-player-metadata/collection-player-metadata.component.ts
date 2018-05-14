import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from './../../services';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-collection-player-metadata',
  templateUrl: './collection-player-metadata.component.html',
  styleUrls: ['./collection-player-metadata.component.css']
})
export class CollectionPlayerMetadataComponent implements OnInit {
  @Input() metaData: object;
  public collectionMeta: any = {};
  public collectionId: string;
  constructor(public resourceService: ResourceService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.collectionId = params.collectionId;
    });
  }
}
