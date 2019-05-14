import { ExtPluginService, UserService } from '@sunbird/core';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-program-component',
  templateUrl: './program.component.html'
})
export class ProgramComponent implements OnInit {

  public programId: string;
  public programDetails: any;
  public userProfile: any;
  public showLoader = true;
  public showOnboardPopup = false;

  constructor(public resourceService: ResourceService, public configService: ConfigService, public activatedRoute: ActivatedRoute,
    public extPluginService: ExtPluginService, public userService: UserService, public toasterService: ToasterService) {
    this.programId = this.activatedRoute.snapshot.params.programId;
    localStorage.setItem('programId', this.programId);
  }

  ngOnInit() {
    this.userProfile = this.userService.userProfile;
    if (['null', null, undefined, 'undefined'].includes(this.programId)) {
      console.log('no programId found'); // TODO: need to handle this case
    }
    this.fetchProgramDetails().subscribe((programDetails) => {
      if (!this.programDetails.userDetails || !this.programDetails.userDetails.onBoarded) {
        this.showOnboardPopup = true;
      }
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching program details failed');
    });
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
      this.showOnboardPopup = false;
    }, error => {
      // TODO: navigate to program list page
      this.toasterService.error(_.get(error, 'error.params.errmsg') || 'Fetching program details failed');
    });
  }
}
