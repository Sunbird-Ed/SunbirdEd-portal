import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { FormService } from '../form/form.service';
import { map } from 'rxjs/operators';
import { UsageService } from '../../../dashboard/services/usage/usage.service';

@Injectable({
  providedIn: 'root'
})

export class GeneraliseLabelService {
  private gResourseBundleForm = {};
  private _gLables: any = {};
  public messages: any = {};
  public frmelmnts: any = {};
  private isTrackable: string;
  private collectionType: string;
  private contentTypeLblKey: string;

  constructor(public formService: FormService, public usageService: UsageService, public resourceService: ResourceService,
    public configService: ConfigService) { }

  public getGeneraliseResourceBundle() {
    const formServiceInputParams = {
        formType: 'generaliseresourcebundles',
        formAction: 'list',
        contentType: 'global',
        component: 'portal'
    };
    this.formService.getFormConfig(formServiceInputParams).subscribe(result => {
        this.gResourseBundleForm = result[0];
    });
  }

  public initialize(contentData: any, lang: string) {
    this.getLabels(contentData, lang);
  }

  private getLabels(contentData: any, lang: string): void {
    const fileName = this.getResourcedFileName(contentData, lang);
    const resourceBundle = _.get(this._gLables, fileName);
    if (!resourceBundle) {
      this.fetchGeneraliseLables(lang, fileName).subscribe(apiResponse => {
        const resourceData = typeof (apiResponse.result) === 'string' ? JSON.parse(apiResponse.result) : apiResponse.result;
          this._gLables[fileName] = resourceData;
          this.setLabels(resourceData);
        }, err => {
          console.log(err);
        });
    } else {
      this.setLabels(resourceBundle);
    }
  }

  private setLabels(labels) {
    const trkStr = this.isTrackable === 'trackable' ? 'trk' : 'nontrk';
    const rbtype =  this.contentTypeLblKey;
    const labelsObj = _.get(labels, `${rbtype}.${trkStr}`);
    const defaulLabels = _.get(labels, `dflt.${trkStr}`);
    const msgLbl = _.merge({}, _.get(defaulLabels, 'messages'), labelsObj && labelsObj.messages);
    const frmelmntsLbl = _.merge({}, _.get(defaulLabels, 'frmelmnts'), labelsObj && labelsObj.frmelmnts);
    this.messages =  labelsObj ? msgLbl : this.resourceService.messages;
    this.frmelmnts = labelsObj ? frmelmntsLbl : this.resourceService.frmelmnts;
  }

  private getResourcedFileName(contentData, lang) {
    this.collectionType = contentData.primaryCategory.toLocaleLowerCase();
    contentData.trackable = (contentData.trackable && typeof contentData.trackable === 'string') ? JSON.parse(contentData.trackable) : contentData.trackable;
    if (!contentData.trackable && this.collectionType === 'course') {
      this.isTrackable = 'trackable';
    } else if (_.get(contentData, 'trackable.enabled') === 'Yes') {
      this.isTrackable = 'trackable';
    } else {
      this.isTrackable = 'nontrackable';
    }
    // this.isTrackable = _.lowerCase(_.get(contentData, 'trackable.enabled')) === 'yes' ? 'trackable' : 'nontrackable';
    const resourceBundleConfig = this.gResourseBundleForm;
    const resourceConfig = _.get(resourceBundleConfig, this.collectionType) || _.get(resourceBundleConfig, 'default');
    this.contentTypeLblKey = resourceConfig.key;
    const resourceBundle = _.get(resourceConfig, `${this.isTrackable}`);
    const blobFilename = _.get(resourceBundle, `${lang}`) || _.get(resourceBundle, 'ar');
    return blobFilename;
  }

  private fetchGeneraliseLables(lang, fileName) {
    const req = {
      url: `${this.configService.urlConFig.URLS.GET_GENERALISED_RESOURCE}/${lang}/${fileName}`
    };
    return this.usageService.getData(req.url).pipe(map((response: any) => {
      return response;
    }));
  }

}
