import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-no-result-found',
  templateUrl: './no-result.component.html',
  styleUrls: ['./no-result.component.scss']
})
export class NoResultComponent implements OnInit {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() buttonText: string;
  @Input() redirectUrl: string;
  instance: string;

  constructor( public router: Router, public resourceService: ResourceService  ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
  }

  exploreMoreContent(url) {
    this.router.navigate([url]);
  }

}
