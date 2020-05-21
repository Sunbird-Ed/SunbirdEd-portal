import { Component, Output, EventEmitter } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { GroupsService } from '../../services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent {
  public memberCreationStep = 1;
  public invalidUserid = false;
  @Output() memberCreation = new EventEmitter<any>();
  public userid = '';
  constructor(public resourceService: ResourceService, public toasterService: ToasterService,  public groupsService: GroupsService,
    private activatedRoute: ActivatedRoute) { }

  VerifyMemberUserId() {
    if (this.userid) {
      this.invalidUserid = false;
      this.memberCreationStep ++;
    } else {
      this.invalidUserid = true;
    }
  }

  async addUserToGroup() {
    const routeParams: any = this.activatedRoute.snapshot.params;
    const groupid = routeParams.groupId;
    const userid = this.userid;
    try {
      const groupMember = await this.groupsService.addMemberToGroup(userid, groupid);
      if (groupMember) {
        this.toasterService.success('Member added successfully');
        this.memberCreationStep = 1;
        this.memberCreation.emit(groupMember);
      }
    } catch (e) {
      this.toasterService.error(e.message);
    }
  }

}
