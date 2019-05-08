import { ExtPluginService, UserService } from '@sunbird/core';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-program-component',
  templateUrl: './program.component.html'
})
export class ProgramComponent implements OnInit, OnDestroy {

  public unsubscribe = new Subject<void>();
  public programId: string;
  public programDetails: any;
  public showLoader = true;
  public showOnboardPopup = false;

  constructor(public resourceService: ResourceService, public configService: ConfigService, public activatedRoute: ActivatedRoute,
    public extPluginService: ExtPluginService, public userService: UserService) {
    this.programId = this.activatedRoute.snapshot.params.programId;
  }

  ngOnInit() {
    console.log(this.programId);
    this.fetchProgramDetails().subscribe((programDetails) => {
      console.log(this.programDetails);
      if (!this.programDetails.userDetails || !this.programDetails.userDetails.onBoarded) {
        this.showOnboardPopup = true;
      }
    }, error => {
      // TODO: navigate to program list page
      console.log('fetching program details failed', error);
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  fetchProgramDetails() {
    const req = {
      // url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
      url: `program/v1/read/${this.programId}`,
      param: {  userId: this.userService.userid }
    };
    return this.extPluginService.get(req).pipe(tap(programDetails => {
      this.programDetails = programDetails.result;
      this.showLoader = false;
    }));
  }
  handleOnboardEvent(event) {
    this.fetchProgramDetails().subscribe((programDetails) => {

    }, error => {
      // TODO: navigate to program list page
      console.log('fetching program details failed', error);
    });
  }
}
