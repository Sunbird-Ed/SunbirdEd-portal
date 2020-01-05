import { Component, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-credits-and-licence',
  templateUrl: './credits-and-licence.component.html',
  styleUrls: ['./credits-and-licence.component.scss']
})
export class CreditsAndLicenceComponent {

  @Input() contentData;
  constructor(public resourceService: ResourceService) { }

  embedUrl(text: string) {
    if (text) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, '<a href="$1">$1</a>');
    }

    return '';
  }
}
