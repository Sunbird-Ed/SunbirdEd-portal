import { Component, Input, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';

export interface ICurriculum {
  label: string;
  count: number;
  class: string;
}

@Component({
  selector: 'app-curriculum-info',
  templateUrl: './curriculum-info.component.html'
})
export class CurriculumInfoComponent implements OnInit {

  @Input() mimeTypeList;

  curriculum: ICurriculum[] = [];
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    _.forEach(this.mimeTypeList, (item) => {
      switch (item.mimeType) {
        case 'application/pdf':
          this.curriculum.push({
            label: this.resourceService.frmelmnts.lbl.pdfcontents,
            count: item.count,
            class: 'file pdf outline icon'
          });
          break;
        case 'video':
          this.curriculum.push({ label: this.resourceService.frmelmnts.lbl.videos, count: item.count, class: 'file video outline icon' });
          break;
        case 'image':
          this.curriculum.push({ label: this.resourceService.frmelmnts.lbl.imagecontents, count: item.count, class: 'file image outline icon' });
          break;
        case 'application/vnd.ekstep.html-archive':
          this.curriculum.push({ label: this.resourceService.frmelmnts.lbl.htmlarchives, count: item.count, class: 'html5 icon' });
          break;
        case 'application/vnd.ekstep.ecml-archive':
          this.curriculum.push({ label: this.resourceService.frmelmnts.lbl.ecmlarchives, count: item.count, class: 'file archive outline icon' });
          break;
        case 'application/epub':
          this.curriculum.push({ label: this.resourceService.frmelmnts.lbl.epubarchives, count: item.count, class: 'file archive outline icon' });
          break;
        case 'application/vnd.ekstep.h5p-archive':
          this.curriculum.push({ label: this.resourceService.frmelmnts.lbl.h5parchives, count: item.count, class: 'file archive outline icon' });
          break;
      }
    });
  }
}
