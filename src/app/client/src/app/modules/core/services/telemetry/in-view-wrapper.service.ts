import { Injectable } from '@angular/core';
import * as _ from 'lodash';

/**
 * InViewWrapperService - Service wrapper class contains methods to store inview data
 * for telemetry impression visits
 */
@Injectable()
export class InViewWrapperService {

  /**
   * inViewLogs - variable to store inview data
   */
  public inViewLogs: Array<any>;

  /**
   * constructor
   */
  constructor() {
    this.inViewLogs = [];
  }

  /**
   * method to check and append incoming data to existing inview data
   * @param data
   */
  public setInViewData(inViewData) {
    _.forEach(inViewData,  (item) => {
      const obj = _.filter(this.inViewLogs, (o: any) => {
        return o.objid === item.data.identifier;
      });
      if (obj.length === 0) {
        this.inViewLogs.push({
          objid: item.data.identifier,
          objtype: item.data.contentType || item.data.mimeType,
          index: item.id
        });
      }
    });
    console.log('visits', this.inViewLogs);
  }

  /**
 * method to get the stored inview data
 */
  public getInviewData() {
    return this.inViewLogs;
  }

}
