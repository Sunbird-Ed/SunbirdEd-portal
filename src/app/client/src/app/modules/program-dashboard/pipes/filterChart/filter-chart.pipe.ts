import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterChart'
})
export class FilterChartPipe implements PipeTransform {

  transform(configId: any, chartData:any,currentFilters:any): unknown {
    return [{ id: configId, data: chartData , selectedFilters: currentFilters }];
  }

}
