import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { environment } from '@sunbird/environment';

@Directive({
  selector: '[appDesktopOnly]'
})
export class DesktopOnlyDirective implements OnInit {
  private hasView = false;
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

  ngOnInit() {
    const isDesktopApp = environment.isDesktopApp;
    if (isDesktopApp && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!isDesktopApp && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
