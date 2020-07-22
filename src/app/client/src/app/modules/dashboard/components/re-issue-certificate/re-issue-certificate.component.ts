import { ResourceService } from '@sunbird/shared';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-re-issue-certificate',
  templateUrl: './re-issue-certificate.component.html',
  styleUrls: ['./re-issue-certificate.component.scss']
})
export class ReIssueCertificateComponent implements OnInit, OnDestroy {

  public unsubscribe$ = new Subject<void>();
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
