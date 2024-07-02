import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash-es";

@Pipe({
  name: "chartType",
})
export class ChartTypePipe implements PipeTransform {
  transform(chartData: any): unknown {
    if (_.isArray(chartData)) {
      return ({
        values: _.compact(chartData),
      });
    } else {
      if(_.get(chartData, "filters")){
          _.map(chartData.filters, (fil => {
          _.has(fil, 'dependency') && _.unset(fil,'dependency')
      }))
      }
  
      return ({
        colors: _.get(chartData, "colors"),
        datasets: _.get(chartData, "datasets"),
        options: _.get(chartData, "options"),
        labelExpr:
          _.get(chartData, "labelsExpr") || _.get(chartData, "labelExpr"),
        filters: _.get(chartData, "filters"),
        type: _.get(chartData, "chartType") || _.get(chartData, "type"),
      });
    }
  }
}
