import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameIntials'
})
export class IntialPipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
      if(value) {
        return value.split(" ").map((n)=>n[0]).join("");
      }
  }

}
