import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'interpolate'
})
export class InterpolatePipe implements PipeTransform {
  transform(text: string, replaceText: string, replacedWith: string): string {
    return _.replace(text, replaceText, replacedWith);
  }
}
