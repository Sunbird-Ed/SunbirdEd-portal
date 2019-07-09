import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ResourceService } from '../../services';
import * as _ from 'lodash-es';
import { IHighlightText } from '../../interfaces';

@Directive({
  selector: '[appHighlightText]'
})
export class HighlightTextDirective implements OnInit, OnDestroy {

  /* Accepts the value for which the text-highlight will work  */
  @Input() config: IHighlightText;

  resourceDataSubscription: any;
  constructor(private elRef: ElementRef, public resourceService: ResourceService) { }

  ngOnInit() {
    if (_.get(this.resourceService, this.config.resourcePath)) {
      this.highlightText(_.get(this.resourceService, this.config.resourcePath), this.config.key, this.config.value);
    }
    this.detectLanguageChange();
  }

  /* replaces the key portion of the label with the highlighted value */
  highlightText(label: string, key: string, value: string) {
    const span = '<span class="sb-pageSection-count sb-label sb-label-xs sb-label-error mr-5">' + value + '</span>';
    this.elRef.nativeElement.innerHTML = label.replace(key, span);
  }

  /* It will detect the change in language and call the highlightText*/
  detectLanguageChange() {
    this.resourceDataSubscription = this.resourceService.languageSelected$.subscribe(item => {
      if (_.get(this.resourceService, this.config.resourcePath)) {
        this.highlightText(_.get(this.resourceService, this.config.resourcePath), this.config.key, this.config.value);
      }
    });
  }

  /* unsubscibes the language change subscription while leaving the directive */
  ngOnDestroy() {
    if (this.resourceDataSubscription) {
      this.resourceDataSubscription.unsubscribe();
    }
  }

}
