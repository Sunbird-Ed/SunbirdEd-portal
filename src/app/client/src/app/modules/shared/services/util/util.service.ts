import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ICard } from '@sunbird/shared';
@Injectable()
export class UtilService {

  getDataForCard(data, staticData, dynamicFields, metaData) {
    const list: Array<ICard> = [];
    _.forEach(data, (item, key) => {
      const card = {
        name: item.name || item.courseName,
        image: item.appIcon || item.courseLogoUrl,
        description: item.description,
        rating: item.me_averageRating || '0'
      };
      _.forIn(staticData, (value, key1) => {
        card[key1] = value;
      });
      _.forIn(metaData, (value, key1) => {
        card[key1] = _.pick(item, value);
      });
        _.forIn(dynamicFields, (fieldData, fieldName) => {
          const value = _.pick(item, fieldData);
          _.forIn(value, (val1, key1) => {
            const name = _.zipObjectDeep([fieldName], [val1]);
            _.forIn(name, (values, index) => {
              card[index] =  _.merge(name[index], card[index]);
            });
          });
        });
      list.push(card);
    });
    return <ICard[]>list;
  }

}
