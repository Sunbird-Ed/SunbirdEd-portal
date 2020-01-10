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

  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
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
