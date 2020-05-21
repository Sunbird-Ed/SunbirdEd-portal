import { Component, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { GroupsService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export enum MemberCreationStage {
  START = 'start',
  VERIFY_MEMBER = 'verify member',
  ADD_MEMBER = 'add member'
}

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})

export class AddMemberComponent implements OnInit, OnDestroy {
  public memberCreationStep = 1;
  public invalidUserid = false;
  @Output() memberCreation = new EventEmitter<any>();
  public unsubscribe$ = new Subject<void>();
  public userid = '';
  public currentStage: any;
  get Stage() { return MemberCreationStage; }

  constructor(public resourceService: ResourceService, public toasterService: ToasterService,  public groupsService: GroupsService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.currentStage = MemberCreationStage.START;
  }

  VerifyMemberUserId() {
    if (this.userid) {
      this.invalidUserid = false;
      this.currentStage = MemberCreationStage.ADD_MEMBER;
    } else {
      this.invalidUserid = true;
    }
  }

  async addUserToGroup() {
    const routeParams: any = this.activatedRoute.snapshot.params;
    const groupid = routeParams.groupId;
    const userid = this.userid;
      this.groupsService.addMemberToGroup(userid, groupid)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(groupData => {
        if (groupData) {
          this.toasterService.success(this.resourceService.messages.smsg.m0145);
          this.currentStage = MemberCreationStage.START;
          this.userid = '';
          this.memberCreation.emit(groupData);
        }
      }, err => {
        this.toasterService.error(err.message);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
