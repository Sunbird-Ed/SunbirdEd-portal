import { Component, OnInit } from '@angular/core';
import { taxonomyEnvironment, taxonomyConfig } from '../../../../framework.config';

@Component({
  selector: 'app-taxonomy-view-wrap',
  templateUrl: './taxonomy-view-wrap.component.html',
  styleUrls: ['./taxonomy-view-wrap.component.scss']
})
export class TaxonomyViewWrapComponent implements OnInit {
  environment = taxonomyEnvironment;
  taxonomyConfig = taxonomyConfig;
  constructor() { }

  ngOnInit(): void {
  }

}
