import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import { LayoutService } from '@sunbird/shared';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html'
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  layoutConfiguration;
  public unsubscribe$ = new Subject<void>();
  constructor(public router: Router,public layoutService: LayoutService) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  ngOnInit() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().
        pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig=> {
        if(layoutConfig!=null) {
          this.layoutConfiguration = layoutConfig.layout;
        } 
      });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
