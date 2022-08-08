import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash-es";

@Pipe({
  name: "bigData",
})
export class BigDataPipe implements PipeTransform {
  transform(bigData: any, bigConfig?: object): unknown {
    if (_.isArray(bigData)) {
      if (bigConfig) {
        let data = [];
        bigData.forEach((expression) => {
          if (expression?.hasOwnProperty(_.get(bigConfig, "dataExpr"))) {
            data.push(expression);
          }
        });
        let applicableData = {
          values: _.compact(data),
        };
        return applicableData;
      } else {
        let applicableData = {
          values: _.compact(bigData),
        };
        return applicableData;
      }
    } else {
      if (bigData?.hasOwnProperty("header")) {
        const bigConfig = {
          header: _.get(bigData, "header"),
          footer: _.get(bigData, "footer"),
          dataExpr: _.get(bigData, "dataExpr"),
          operation: "SUM",
        };
        return bigConfig;
      }
    }
  }
}
