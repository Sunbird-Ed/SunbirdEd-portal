import { Injectable } from '@angular/core';
import { CsMimeType } from '../../../shared/interfaces/cs-mime-type';

@Injectable({
  providedIn: 'root'
})
export class ProgressPlayerService {

  private PLAYBACK_MIME_TYPES = [CsMimeType.YOUTUBE, CsMimeType.VIDEO, CsMimeType.WEBM, CsMimeType.PDF, CsMimeType.EPUB];
  private OTHER_MIME_TYPES = [CsMimeType.H5P, CsMimeType.HTML];

  constructor() { }

  getContentProgress(summary: any[], mimeType: CsMimeType): number {
    const summaryMap = summary.reduce((acc, s) => {
      Object.keys(s).forEach((k) => {
        acc[k] = s[k];
      });
      return acc;
    }, {});

    if (!summaryMap.progress) {
      return 0;
    }

    if (this.PLAYBACK_MIME_TYPES.indexOf(mimeType) > -1) {
      return this.calculatePlaybackProgress(
        summaryMap['progress'] || 0,
        summaryMap['visitedlength'] || 0,
        summaryMap['totallength'] || 0,
        summaryMap['endpageseen'] || false,
        summaryMap['visitedcontentend'] || false,
        summaryMap['totalseekedlength'] || 0
      );
    } else if (
      this.OTHER_MIME_TYPES.indexOf(mimeType) > -1
    ) {
      return this.absoluteProgress(summaryMap.progress, 0);
    } else {
      return this.absoluteProgress(summaryMap.progress, 100);
    }
  }

  calculatePlaybackProgress(
    progress: number,
    visitedLength: number,
    totalLength: number,
    endPageSeen: boolean,
    visitedContentEnd: boolean,
    totalSeekedlength: number
  ) {
    let customProgress;
    if ((totalLength && ((visitedLength + totalSeekedlength) * 100) / totalLength) > 99) {
      customProgress = 100;
    } else {
      customProgress = progress;
    }
    return customProgress;
  }

  absoluteProgress(progress: number, threshold: number): number {
    if (progress >= threshold) {
      return 100;
    }
    return 0;
  }
}