import { Component, OnInit, Input, EventEmitter, Output, OnChanges, ViewChild } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { ContentData, ContentCreditsData } from '@sunbird/shared';
import { fromEvent, Subject } from 'rxjs';

@Component({
  selector: 'app-content-credits',
  templateUrl: './content-credits.component.html',
  styleUrls: ['./content-credits.component.scss']
})
export class ContentCreditsComponent implements OnInit, OnChanges {
  @Input() contentData: ContentData;
  @Output() close = new EventEmitter<any>();
  @ViewChild('contentCreditsModal') contentCreditsModal;

  showContentCreditModal = false;
  instance: string;
  contentCreditsData: ContentCreditsData;
  private unsubscribe = new Subject<void>();

  constructor(public resourceService: ResourceService) {
  }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    /* Listen for back button click and close popup */
    fromEvent(window, 'popstate')
      .subscribe((e) => {
        this.closeModal(this.contentCreditsModal);
      });
  }

  ngOnChanges() {
    this.contentCreditsData = { contributors: '', creators: '', attributions: '', copyright: '' };
    if (this.contentData) {
      if (this.contentData.copyright) {
        this.contentCreditsData['copyright'] = this.contentData.copyright;
      }
      // contributors , it is a combination of content credits names, creators, and owner
      const contentCredits = _.get(this.contentData, 'contentCredits');
      const contentCreditNames = contentCredits && contentCredits.length ? _.map(contentCredits, 'name') : [];
      const contirbutors = this.contentData['contributors'] ? this.contentData['contributors'].split(',') : [];
      if (this.contentData['owner']) {
        contirbutors.push(this.contentData['owner']);
      }
      this.contentCreditsData['contributors'] = (_.compact(_.uniq(_.union(contentCreditNames, contirbutors).sort())).join(', '));
      // creators is a combination of creators and creator
      const creators = this.contentData['creators'] ? this.contentData['creators'].split(',') : [];
      if (this.contentData['creator']) {
        creators.push(this.contentData['creator']);
      }
      // attributors
      if (_.get(this.contentData, 'attributions')) {
        const attributions = _.isString(_.get(this.contentData, 'attributions')) ?
          _.get(this.contentData, 'attributions').split(',') : _.get(this.contentData, 'attributions');
        this.contentCreditsData['attributions'] = (_.compact(_.uniq(attributions).sort()).join(', '));
      }
    }
  }

  public closeModal(contentCreditsModal) {
    contentCreditsModal.deny();
    this.close.emit();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
