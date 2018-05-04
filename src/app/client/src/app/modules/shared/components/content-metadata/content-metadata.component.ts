import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from './../../services';
import * as _ from 'lodash';
import { ContentData } from './../../interfaces';

@Component({
  selector: 'app-content-metadata',
  templateUrl: './content-metadata.component.html',
  styleUrls: ['./content-metadata.component.css']
})
export class ContentMetadataComponent implements OnInit {
  @Input() contentData: ContentData;
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
  }
  getConceptsNames(concepts) {
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
