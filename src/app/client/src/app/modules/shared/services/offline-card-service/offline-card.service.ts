import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class OfflineCardService {

  constructor() { }

  isYoutubeContent(content) {
    let mimeTypesCountObj;
    const contentData = _.isEmpty(_.get(content, 'metaData')) ? content : content.metaData;
    try { mimeTypesCountObj = JSON.parse(content.mimeTypesCount); } catch (error) { mimeTypesCountObj = undefined; }
    if (_.includes(['video/youtube', 'video/x-youtube'], contentData.mimeType)
      || _.has(mimeTypesCountObj, 'video/youtube') || _.has(mimeTypesCountObj, 'video/x-youtube')) {
      return true;
    }
      return false;
  }
}
