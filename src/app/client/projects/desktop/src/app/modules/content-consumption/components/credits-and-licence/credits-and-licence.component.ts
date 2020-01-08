import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-credits-and-licence',
  templateUrl: './credits-and-licence.component.html',
  styleUrls: ['./credits-and-licence.component.scss']
})
export class CreditsAndLicenceComponent {

  @Input() contentData;
  @ViewChild('licence') licenceElement: ElementRef;

  constructor(public resourceService: ResourceService) { }

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
