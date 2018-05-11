import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { ContentData, ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-content-player-metadata',
  templateUrl: './content-player-metadata.component.html',
  styleUrls: ['./content-player-metadata.component.css']
})
export class ContentPlayerMetadataComponent {
  @Input() contentData: ContentData;
  constructor(public resourceService: ResourceService) { }
/**
 * Fetches concepts
 * @param {any} concepts
 * @returns {string}
 */
getConceptsNames(concepts): string {
    const conceptNames = _.map(concepts, 'name');
    if (concepts && conceptNames.length < concepts.length) {
      // const filteredConcepts = _.filter($rootScope.concepts, (p) => {
      //   return _.includes(concepts, p.identifier);
      // });
      // conceptNames = _.map(filteredConcepts, 'name');
    }
    return conceptNames.toString();
  }
}
