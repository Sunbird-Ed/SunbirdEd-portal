import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import * as marked from 'marked';

@Directive({
  selector: '[appMarkdown]'
})
export class MarkdownDirective implements OnChanges {

  @Input() input: string;
  @Input() options = {};

  constructor(private el: ElementRef) {
    this.setOptions();
    this.convertMd();
  }

  private setOptions() {
    marked.setOptions({
      pedantic: false,
      gfm: true,
      breaks: true,
      smartLists: true,
      smartypants: false,
      xhtml: true,
      ...this.options
    });
  }

  ngOnChanges() {
    this.convertMd();
  }

  private convertMd() {
    this.el.nativeElement.innerHTML = marked(this.input || '');
  }
}
