import { Component, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { TelemetryService, IInteractEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-completion',
  templateUrl: './course-completion.component.html',
  styleUrls: ['./course-completion.component.scss']
})
export class CourseCompletionComponent implements OnDestroy {

  @ViewChild('modal') modal;
  @Input() certificateDescription;
  @Output() close = new EventEmitter<void>();
  constructor(
    public resourceService: ResourceService,
    private telemetryService: TelemetryService,
    private activatedRoute: ActivatedRoute
    ) { }

  closeModal() {
    /* istanbul ignore else */
    if (_.get(this.modal, 'deny')) {
      this.modal.deny();
      this.logInteractTelemetry();
      this.close.emit();
    }
  }

  logInteractTelemetry() {
    const interactData: IInteractEventInput = {
      context: {
        cdata: [{ id: 'course-completion', type: 'Feature' }],
        env: this.activatedRoute.snapshot.data.telemetry.env,
      },
      edata: {
        id: 'close-course-completion-modal',
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      }
    };
    this.telemetryService.interact(interactData);
  }

  ngOnDestroy() {
    this.closeModal();
  }
}
