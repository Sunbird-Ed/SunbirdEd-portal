import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-workspace',
  templateUrl: './group-workspace.component.html',
  styleUrls: ['./group-workspace.component.scss']
})
export class GroupWorkspaceComponent implements OnInit {
  public  membersList = [
    {identifier: '1', initial: 'A', title: 'Abc', isAdmin: true,  isMenu: true, indexOfMember: 1},
    {identifier: '2', initial: 'B', title: 'Bcd', isMenu: true, indexOfMember: 5 },
    {identifier: '6', initial: 'C', title: 'Cde', isMenu: true, indexOfMember: 7}
  ];
  showMenu: Boolean = false;
  showModal: Boolean = false;
  modalName: string;
  selectedMember: {};
  constructor() { }

  ngOnInit() {
  }
  getMenuData(event) {
    this.showMenu = !this.showMenu;
    this.selectedMember = event.data;
  }

  openModal(name) {
    this.showModal = !this.showModal;
    this.modalName = name;
  }
}
