import { Injectable } from "@angular/core";
import * as _ from "lodash-es";

@Injectable({
  providedIn: "root",
})
export class PdServiceService {
  constructor() {
    // This is intentional
  }

  getFilteredData(data, selectedFilters) {
    return _.filter(data, (dataItem) => {
      return _.every(selectedFilters, (value, key) => {
        if (dataItem?.[key]) {
          if (_.isArray(value)) {
            return _.some(value, (val) => val === dataItem[key]);
          }
          return value === dataItem[key];
        }
      });
    });
  }
}