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
    console.log(this.fetchProgramDetails, 'fetch program details');
    this.programDetails = {"programId":"31ab2990-7892-11e9-8a02-93c5c62c03f1","config":{"roles":[{"role":"CONTRIBUTOR"},{"role":"REVIEWER"}],"onBoardForm":{"templateName":"onBoardingForm","action":"onboard","fields":[{"code":"class","dataType":"text","name":"Class","label":"Class","description":"Class","inputType":"multi-select","required":false,"displayProperty":"Editable","visible":true,"range":[{"identifier":"Class 1","code":"class1","name":"Class 1","description":"Class 1","index":1,"category":"class","status":"Live"},{"identifier":"Class 2","code":"class2","name":"Class 2","description":"Class 2","index":2,"category":"class","status":"Live"},{"identifier":"Class 3","code":"class3","name":"Class 3","description":"Class 3","index":3,"category":"class","status":"Live"}],"index":1}]},"scope":{"board":["NCERT"],"gradeLevel":["Kindergarten","Grade 1","Grade 2","Grade 3","Grade 4"],"medium":["English"],"subject":["Mathematics","English","Telugu","Hindi"],"topics":["Addition"],"framework":"NCFCOPY","channel":"b00bc992ef25f1a9a8d63291e20efc8d"}},"defaultRoles":["CONTRIBUTOR"],"description":"hello program","endDate":null,"name":"CBSC","slug":"sunbird","startDate":"2019-02-03T07:20:30.000Z","status":null,"type":"private","userDetails":{"programId":"31ab2990-7892-11e9-8a02-93c5c62c03f1","userId":"874ed8a5-782e-4f6c-8f36-e0288455901e","enrolledOn":"2019-05-17T10:55:07.513Z","onBoarded":true,"onBoardingData":{"class":["Class 1"]},"roles":["CONTRIBUTOR"]}};
    this.showLoader = false;
    // this.fetchProgramDetails().subscribe((programDetails) => {
    //   if (!this.programDetails.userDetails || !this.programDetails.userDetails.onBoarded) {
    //     this.showOnboardPopup = true;
    //   }
    // }, error => {
    //   // TODO: navigate to program list page
    //   const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
    //   this.toasterService.error(errorMes || 'Fetching program details failed');
    // });
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
      console.log('fetching program details failed', error);
    });
  }
}