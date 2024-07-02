import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe(
    { name: 'translateJson' }
)

export class TranslateJsonPipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(value: string, args?: {[key: string]: string}): string {
    try {
      const availableTranslation = JSON.parse(value);
      let outputStr = '';
      if (availableTranslation.hasOwnProperty(this.translate.currentLang)) {
        outputStr = availableTranslation[this.translate.currentLang];
      } else if (availableTranslation.hasOwnProperty(this.translate.defaultLang)) {
        outputStr = availableTranslation[this.translate.defaultLang];
      }
      for (const key in args) {
        outputStr = outputStr.replace(key, args[key]);
      }
      return outputStr;
    } catch (e) {
      return value;
    }
  }
}