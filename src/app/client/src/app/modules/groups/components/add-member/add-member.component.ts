import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {
  // isAddMember = true;
  isVerifyMember = false;
  isAddTogroup = false;
  constructor() { }

  ngOnInit() {
  }
  addMember() {
    this.isVerifyMember = true;
  }

  verifyMember() {
  this.isVerifyMember = false;
  this.isAddTogroup = true;
  }

  addMemberToGroup() {
    this.isAddTogroup = false;
  }
}
