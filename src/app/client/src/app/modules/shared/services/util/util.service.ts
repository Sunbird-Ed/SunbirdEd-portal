import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
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
    const content: any = {
      name: data.name || data.courseName,
      image: data.appIcon || data.courseLogoUrl,
      addedToLibrary: data.addedToLibrary || false,
      description: data.description,
      rating: data.me_averageRating || '0',
      subject: data.subject,
      medium: data.medium,
      orgDetails: data.orgDetails || {},
      gradeLevel: '',
      contentType: data.contentType,
      topic: this.getTopicSubTopic('topic', data.topic),
      subTopic: this.getTopicSubTopic('subTopic', data.topic),
      metaData: {},
      completionPercentage: data.completionPercentage || 0,
      mimeTypesCount: data.mimeTypesCount || 0
    };

    // this customization is done for enrolled courses
    if (_.has(data, 'content')) {
      content['topic'] = this.getTopicSubTopic('topic', data.content.topic);
      content['subTopic'] = this.getTopicSubTopic('subTopic', data.content.topic);
      content['contentType'] = _.get(data.content, 'contentType') || '';
      content['orgDetails'] = _.get(data.content, 'orgDetails') || {};
    }

    if (data.gradeLevel && data.gradeLevel.length) {
        content['gradeLevel'] = _.isString(data.gradeLevel) ? data.gradeLevel : data.gradeLevel.join(',');
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

  public getTopicSubTopic (type, topic) {
    if (type === 'topic') {
      return _.size(topic) > 0 ? topic[0] : '';
    } else {
      return _.size(topic) > 1 ? topic[1] : '';
    }
  }

  public toggleAppPopup() {
    this.showAppPopUp = !this.showAppPopUp;
  }



  public manipulateSoftConstraint(filter, softConstraintData, frameWorkData?: any) {
    if (!_.isEmpty(frameWorkData) && !filter) {
      return {filters: _.omit(frameWorkData, ['id']), mode: 'soft'};
    } else if (filter) {
     return false;
    } else {
      return softConstraintData;
    }
  }

  translateValues(data, lang) {
    _.forEach(data, (value, index) => {
      if (value.children) {
        this.convert(value, lang);
        _.forEach(value.children, (children) => {
          this.convert(children, lang);
        });
      } else if (value.translations) {
        this.convert(value, lang);
      }
    });
    return data;
  }

  convert(value, lang) {
    const translations = JSON.parse(value.translations);
    if (translations) {
      if (!translations.en) {
        translations.en = value.name;
        value.translations = JSON.stringify(translations);
      }
      if (translations[lang]) {
        value.name = translations[lang];
      } else {
        value.name = translations['en'];
      }
    }
  }
  translateLabel(formFieldCategory, selectedLanguage) {
    if (!formFieldCategory.translations) {
      return formFieldCategory;
    }
    const translation = JSON.parse(formFieldCategory.translations);
    if (translation && !translation.en) {
      translation.en = formFieldCategory.label;
      formFieldCategory.translations = JSON.stringify(translation);
    }
    if (translation && translation[selectedLanguage]) {
      formFieldCategory.label = translation[selectedLanguage];
      return formFieldCategory;
    } else {
      return formFieldCategory;
    }
  }
  convertSelectedOption(selectedData, formFieldProperties, selectedLanguage, convertLanguage) {
    const formInputData = selectedData;
    _.forIn(selectedData, (inputData, key) => {
      const fieldValue = _.find(formFieldProperties, ['code', key]);
      if (fieldValue) {
        _.forEach(fieldValue.range, (collector) => {
          if (_.get(collector, 'translations')) {
            const translations = JSON.parse(collector.translations);
            _.forEach(inputData, (text) => {
              if (translations !== null) {
                const language = _.findKey(translations, (v) => {
                  return v === text;
                });
                const index = _.findIndex(inputData, (o) => o === text);
                if ((translations[selectedLanguage] === text || translations[language] === text)) {
                  const value = translations[convertLanguage] ? translations[convertLanguage] : translations['en'];
                  formInputData[key].splice(index, 1, value);
                }
              }
            });
          }
        });
      }
    });
    return formInputData;
  }
}
