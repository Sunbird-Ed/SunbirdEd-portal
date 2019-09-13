import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class OfflineCardService {

  constructor() { }

  checkYoutubeContent(data) {
    let isYoutube;
    try { isYoutube = JSON.parse(data.mimeTypesCount); } catch (error) { isYoutube = undefined; }
    if (_.includes(['video/youtube', 'video/x-youtube'], data.metaData.mimeType)
      || _.has(isYoutube, 'video/youtube') || _.has(isYoutube, 'video/x-youtube')) {
      return true;
    } else {
      return false;
    }
  }
}
