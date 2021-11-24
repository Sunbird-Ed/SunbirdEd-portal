import { ResourceService, LayoutService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent implements OnInit {

layoutConfiguration: any;
public unsubscribe = new Subject<void>();
  constructor(public resourceService: ResourceService,
    private groupService: GroupsService, public layoutService: LayoutService, private activatedRoute: ActivatedRoute) { }

  goBack() {
    this.groupService.addTelemetry({id: 'back-button'}, this.activatedRoute.snapshot, []);
    this.groupService.goBack();
  }

  ngOnInit() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().
      pipe(takeUntil(this.unsubscribe)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
      });
    }
}
