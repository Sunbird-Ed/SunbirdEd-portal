import { MY_GROUPS } from '../routerLinks';
import { Component, OnInit } from '@angular/core';
import { ResourceService, NavigationHelperService, LayoutService } from '@sunbird/shared';
import { TelemetryService, IImpressionEventInput } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UtilService } from '../../../../../shared/services/util/util.service';
import { ElectronService } from '../../../../../core/services/electron/electron.service';
import { ConfigService } from '../../../../../shared/services/config/config.service';
@Component({
  selector: 'app-explore-group',
  templateUrl: './explore-group.component.html',
  styleUrls: ['./explore-group.component.scss']
})
export class ExploreGroupComponent implements OnInit {
  showWelcomePopup = true;
  telemetryImpression: IImpressionEventInput;
  layoutConfiguration;
  isDesktopApp = false;
  public unsubscribe$ = new Subject<void>();
  constructor(
    public resourceService: ResourceService, private activatedRoute: ActivatedRoute,
    private telemetryService: TelemetryService, private router: Router,
    private navigationhelperService: NavigationHelperService, public layoutService: LayoutService,
    private utilService: UtilService, private electronService: ElectronService, private config: ConfigService
  ) { }

  redirectTologin() {
    if (this.isDesktopApp)  {
      this.electronService.get({ url: this.config.urlConFig.URLS.OFFLINE.LOGIN}).subscribe();
    } else {
      window.location.href = MY_GROUPS;
    }
  }

  showFtuPopup(visibility: boolean = false) {
    this.showWelcomePopup = visibility;
  }

  ngOnInit() {
    this.isDesktopApp = this.utilService.isDesktopApp;
    this.showWelcomePopup = !localStorage.getItem('anonymous_ftu_groups');
    this.initLayout();
    this.telemetryImpression = {
      context: {
        env: _.get(this.activatedRoute, 'snapshot.data.telemetry.env')
      },
      edata: {
        type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
        pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid'),
        subtype: _.get(this.activatedRoute, 'snapshot.data.telemetry.subtype'),
        uri: this.router.url,
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
  }
  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().
    pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
    if (layoutConfig != null) {
      this.layoutConfiguration = layoutConfig.layout;
    }
   });
  }

  addTelemetry (id) {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute, 'snapshot.data.telemetry.env'),
        cdata: []
      },
      edata: {
        id: id,
        type: 'click',
        pageid:  _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid'),
      },
    };
    this.telemetryService.interact(interactData);
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
