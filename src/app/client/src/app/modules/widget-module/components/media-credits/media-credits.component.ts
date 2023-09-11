import { Component, Input, OnInit } from '@angular/core';
import { ResourceService } from '../contentpageinterfaces';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-media-credits',
  templateUrl: './media-credits.component.html',
  styleUrls: ['./media-credits.component.scss']
})
export class MediaCreditsComponent implements OnInit {

  @Input() contentData;
  public transcriptsInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;
  instance: string;
  isCollapsed = false;
  showDownloadPopup = false;
  options = [];
  transcriptLanguage = '';
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
  }
  
}
