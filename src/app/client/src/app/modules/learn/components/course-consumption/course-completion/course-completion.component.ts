<<<<<<< HEAD
import { Component, OnDestroy, ViewChild, Input } from '@angular/core';
=======
import { Component, OnDestroy, ViewChild } from '@angular/core';
>>>>>>> fc89be81970a97121b633131c33b78409f6e5189
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
  @Input() isCertificateAttached;
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
