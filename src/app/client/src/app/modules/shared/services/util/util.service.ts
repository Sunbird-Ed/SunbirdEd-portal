import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ICard } from '@sunbird/shared';
import { Subject, Observable } from 'rxjs';
  // Dependency injection creates new instance each time if used in router sub-modules
export class UtilService {
  static singletonInstance: UtilService;
  public showAppPopUp = false;
  constructor() {
    if (!UtilService.singletonInstance) {
      UtilService.singletonInstance = this;
    }
    return UtilService.singletonInstance;
  }
  getDataForCard(data, staticData, dynamicFields, metaData) {
    const list: Array<ICard> = [];
    _.forEach(data, (item, key) => {
      const card = this.processContent(item, staticData, dynamicFields, metaData);
      list.push(card);
    });
    return <ICard[]>list;
  }

  processContent(data, staticData, dynamicFields, metaData) {
    let fieldValue: any;
    const content = {
      name: data.name || data.courseName,
      image: data.appIcon || data.courseLogoUrl,
      description: data.description,
      rating: data.me_averageRating || '0',
      subject: data.subject,
      medium: data.medium,
      orgDetails: data.orgDetails,
      gradeLevel: '',
      resourceType: data.resourceType
    };
    if (data.gradeLevel && data.gradeLevel.length) {
      if (typeof(data.gradeLevel) === 'string') {
        content['gradeLevel'] = data.gradeLevel;
      } else {
        content['gradeLevel'] = data.gradeLevel.join(',');
      }
    }
    _.forIn(staticData, (value, key1) => {
      content[key1] = value;
    });
    _.forIn(metaData, (value, key1) => {
      content[key1] = _.pick(data, value);
    });
    _.forIn(dynamicFields, (fieldData, fieldName) => {
      fieldValue = _.get(data, fieldData);
      const name = _.zipObjectDeep([fieldName], [fieldValue]);
      _.forIn(name, (values, index) => {
        content[index] = _.merge(name[index], content[index]);
      });
    });
    return content;
  }
  public toggleAppPopup() {
    this.showAppPopUp = !this.showAppPopUp;
  }
}
