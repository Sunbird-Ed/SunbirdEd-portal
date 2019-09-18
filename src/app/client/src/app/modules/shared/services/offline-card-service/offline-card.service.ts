import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class OfflineCardService {

  constructor() { }

  isYoutubeContent(content) {
    let mimeTypesCountObj;
    try { mimeTypesCountObj = JSON.parse(content.mimeTypesCount); } catch (error) { mimeTypesCountObj = undefined; }
    if (_.includes(['video/youtube', 'video/x-youtube'], content.metaData.mimeType)
      || _.has(mimeTypesCountObj, 'video/youtube') || _.has(mimeTypesCountObj, 'video/x-youtube')) {
      return true;
    } else {
      return false;
    }
  }
}
