import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ResourceService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ConnectionService } from '../../services';
import * as _ from 'lodash-es';
import { TelemetryService } from '@sunbird/telemetry';
@Component({
  selector: 'app-no-content',
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.scss']
})
export class NoContentComponent implements OnInit, OnDestroy {
  isConnected;
  showModal = false;
  showLoadContentModal: any;
  public unsubscribe$ = new Subject<void>();
  @Input() filters;
  instance: string;
  @Input() isContentPresent = true;

  constructor(
    public router: Router,
    public connectionService: ConnectionService,
    public resourceService: ResourceService,
    public activatedRoute: ActivatedRoute,
    public telemetryService: TelemetryService
  ) {}

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.connectionService.monitor().pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

  isBrowsePage() {
    return  _.includes(this.router.url, 'browse');
  }

  handleImportContentDialog(id) {
      this.showLoadContentModal = !this.showLoadContentModal;
    this.addInteractEvent(id);
  }
  closeLoadContentModal() {
    this.showLoadContentModal = !this.showLoadContentModal;
  }
  handleModal(id) {
    this.showModal = !this.showModal;
    if (! _.isEmpty(id)) {this.addInteractEvent(id); }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addInteractEvent(id) {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'browse',
        cdata: []
      },
      edata: {
        id: id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'library',
      }
    };
    this.telemetryService.interact(interactData);
  }

  exploreContent(id) {
    this.addInteractEvent(id);
    this.router.navigate(['/search'], { queryParams:
      {board: _.get(this.filters, 'board'), medium: _.get(this.filters, 'medium'), gradeLevel: _.get(this.filters, 'gradeLevel')}});
  }
}
