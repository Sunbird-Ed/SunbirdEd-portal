import { Component, Input, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-credits-and-licence',
  templateUrl: './credits-and-licence.component.html',
  styleUrls: ['./credits-and-licence.component.scss']
})
export class CreditsAndLicenceComponent implements OnInit {

  @Input() contentData;
  instance: string;


  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
  }

}
