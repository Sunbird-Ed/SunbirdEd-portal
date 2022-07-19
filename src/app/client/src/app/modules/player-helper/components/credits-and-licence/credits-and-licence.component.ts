import { Component, Input, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-credits-and-licence',
  templateUrl: './credits-and-licence.component.html',
  styleUrls: ['./credits-and-licence.component.scss']
})
export class CreditsAndLicenceComponent implements OnInit {

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
    this.createOptionOrDownload();
  }
  showDownloadTranscript() {
    this.showDownloadPopup = true
  }
  changeTranscriptlanguage(event) {
    this.transcriptLanguage = event.value
  }
  createOptionOrDownload(download?: boolean) {
    const transcriptsObj = this.contentData?.transcripts
    if (transcriptsObj) {
      let transcripts = [];
        if(typeof transcriptsObj === 'string') {
          transcripts = JSON.parse(transcriptsObj);
        } else{
          transcripts = transcriptsObj;
        }
      if (transcripts && transcripts.length > 0) {
        transcripts.forEach(item => {
          if (download) {
            if (item.language === this.transcriptLanguage) {
              const url = (_.get(item, 'artifactUrl'));
              if (url) { window.open(url, '_blank'); }
            }
          } else {
            this.options.push(item.language);
          }
        });
      }
    }
  }
  dowloadTranscript() {
    this.transcriptsInteractEdata = {
      id: 'download-transcripts',
      type: 'click',
      pageid: 'content-details'
    }
    this.showDownloadPopup = false;
    this.createOptionOrDownload(true);
  }
}
