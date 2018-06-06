import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'cdnprefixurl'
})
export class CdnprefixPipe implements PipeTransform {
  cdnBaseUrl: string = (<HTMLInputElement>document.getElementById('cdnUrl')) ?
    (<HTMLInputElement>document.getElementById('cdnUrl')).value : '';
  transform(value: any): any {
    if (_.startsWith(value, 'assets/')) {
      return this.cdnBaseUrl + value;
    }
    return value;
  }

}
