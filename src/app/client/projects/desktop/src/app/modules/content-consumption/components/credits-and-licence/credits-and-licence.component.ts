import { Component, Input, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-credits-and-licence',
  templateUrl: './credits-and-licence.component.html',
  styleUrls: ['./credits-and-licence.component.scss']
})
export class CreditsAndLicenceComponent implements OnInit, AfterViewInit {

  @Input() contentData;
  @ViewChild('licence') licenceElement: ElementRef;

  instance: string;
  attributions: string;

  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);

    if (this.contentData) {

      // contributors , it is a combination of content credits names, creators, and owner
      const contentCredits = _.get(this.contentData, 'contentCredits');
      const contentCreditNames = contentCredits && contentCredits.length ? _.map(contentCredits, 'name') : [];
      let contributors = this.contentData['contributors'] ? this.contentData['contributors'].split(',') : [];

      if (this.contentData['owner']) {
        contributors.push(this.contentData['owner']);
      }

      contributors = (_.compact(_.uniq(_.union(contentCreditNames, contributors).sort())).join(', '));

      // creators is a combination of creators and creator
      const creators = this.contentData['creators'] ? this.contentData['creators'].split(',') : [];

      if (this.contentData['creator']) {
        creators.push(this.contentData['creator']);
      }

      // attributors
      const attributions = _.isString(_.get(this.contentData, 'attributions')) ?
        _.get(this.contentData, 'attributions').split(',') : _.get(this.contentData, 'attributions');
      this.attributions = (_.compact(_.uniq(_.union
        (contentCreditNames, contributors, attributions, creators).sort())).join(', '));
    }
  }

  ngAfterViewInit() {
    if (this.contentData && this.contentData.license) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      this.licenceElement.nativeElement.innerHTML = this.contentData.license.replace(urlRegex, '<a href="">$1</a>');
      this.licenceElement.nativeElement.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
    }
  }
}
