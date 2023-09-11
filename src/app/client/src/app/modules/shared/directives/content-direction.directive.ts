import { ConfigService } from '../services';
import { Directive, ElementRef, Input, AfterViewInit, Renderer2 } from '@angular/core';
import * as _ from 'lodash-es';
import { CacheService } from '../services/cache-service/cache.service';
@Directive({
  selector: '[appContentDirection]'
})
export class ContentDirectionDirective implements AfterViewInit  {
  /**
   * input data
  */
  @Input() data ?: any;
  /**
   * Property of configService used to map the medium code
   */
  public mediumCode: any;
  constructor(private elRef: ElementRef, private renderer: Renderer2,
  private configService: ConfigService, private cacheService: CacheService) { }

  ngAfterViewInit(): void {
    this.mediumCode = this.configService.appConfig.mediumCode;
    if (_.get(this.data, 'medium')) {
      const langCode = _.get(this.mediumCode, _.lowerCase(this.data.medium));
      if (this.cacheService.get('resourcebundlesearch')) {
        const data = this.cacheService.get('resourcebundlesearch');
        const item =  (_.find(data[0].range, ['value', langCode]));
        if (item) {
          this.renderer.setAttribute(this.elRef.nativeElement, 'lang' , item.value);
          this.renderer.setAttribute(this.elRef.nativeElement, 'dir' , item.dir);
        } else {
          const englishLanguage = (_.find(data[0].range, ['value', 'en']));
          this.renderer.setAttribute(this.elRef.nativeElement, 'lang' , englishLanguage.value);
          this.renderer.setAttribute(this.elRef.nativeElement, 'dir' , englishLanguage.dir);
        }
      }
    }
  }

}
