import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { LayoutService, COLUMN_TYPE } from '../../services/layoutconfig/layout.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ResourceService } from '../../services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-landing-section',
  templateUrl: './app-landing-section.component.html',
  styleUrls: ['./app-landing-section.component.scss']
})
export class AppLandingSectionComponent implements OnInit {
 @Input() showBanner = true
  @Input() textToDisplay;

  @Input() svgToDisplay;

  @Input() layoutConfiguration;

  @Input() noTitle;

  FIRST_PANEL_LAYOUT;
  SECOND_PANEL_LAYOUT;
  titleToDisplay;
  public unsubscribe$ = new Subject<void>();

  constructor(public layoutService: LayoutService, private resourceService: ResourceService) { }

  ngOnInit() {
    this.initLayout();
  }
  initLayout() {
    this.redoLayout();
    this.layoutService.switchableLayout().
        pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
        this.redoLayout();
      });
  }
  redoLayout() {
      if (this.layoutConfiguration != null) {
        this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, this.layoutConfiguration, COLUMN_TYPE.threeToNine);
        this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, this.layoutConfiguration, COLUMN_TYPE.threeToNine);
      } else {
        this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, null, COLUMN_TYPE.fullLayout);
        this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, null, COLUMN_TYPE.fullLayout);
      }
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
