import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss']
})
export class GroupMembersComponent implements OnInit {
  public  membersList = [
    {identifier: '1', initial: 'A', title: 'Abc', isAdmin: true,  isMenu: true, indexOfMember: 1},
    {identifier: '2', initial: 'B', title: 'Bcd', isMenu: true, indexOfMember: 5 },
    {identifier: '6', initial: 'C', title: 'Cde', isMenu: true, indexOfMember: 7}
  ];
  showMenu: Boolean = false;
  showModal: Boolean = false;
  modalName: string;
  selectedMember: {};
  groupId;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');
  }

  getMenuData(event) {
    this.showMenu = !this.showMenu;
    this.selectedMember = event.data;
  }

  openModal(name) {
    this.showModal = !this.showModal;
    this.modalName = name;
  }

  addMember() {
    this.router.navigate(['my-groups/group-details', this.groupId, 'add-member-to-group']);
  }
}
