import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  sbcards = [
    {
      title: 'Group Name 123',
      subject: 'Social Science',
      class: 'Class 8',
      medium: 'Hindi',
      board: 'CBSE',
      type: 'Book'
    },
    {
      title: 'Group Name 123',
      subject: 'Social Science',
      class: 'Class 8',
      medium: 'Hindi',
      board: 'CBSE',
      type: 'Book'
    },
    {
      title: 'Group Name 123',
      subject: 'Social Science',
      class: 'Class 8',
      medium: 'Hindi',
      board: 'CBSE',
      type: 'Book'
    },
    {
      title: 'Group Name 123',
      subject: 'Social Science',
      class: 'Class 8',
      medium: 'Hindi',
      board: 'CBSE',
      type: 'Book'
    },
    {
      title: 'Group Name 123',
      subject: 'Social Science',
      class: 'Class 8',
      medium: 'Hindi',
      board: 'CBSE',
      type: 'Book'
    },
    {
      title: 'Group Name 123',
      subject: 'Social Science',
      class: 'Class 8',
      medium: 'Hindi',
      board: 'CBSE',
      type: 'Book'
    },
    {
      title: 'Group Name 123',
      subject: 'Social Science',
      class: 'Class 8',
      medium: 'Hindi',
      board: 'CBSE',
      type: 'Book'
    },
    {
      title: 'Group Name 123',
      subject: 'Social Science',
      class: 'Class 8',
      medium: 'Hindi',
      board: 'CBSE',
      type: 'Book'
    },
    {
      title: 'Group Name 123',
      subject: 'Social Science',
      class: 'Class 8',
      medium: 'Hindi',
      board: 'CBSE',
      type: 'Book'
    },
    {
      title: 'Group Name 123',
      subject: 'Social Science',
      class: 'Class 8',
      medium: 'Hindi',
      board: 'CBSE',
      type: 'Book'
    },
    {
      title: 'Group Name 123',
      subject: 'Social Science',
      class: 'Class 8',
      medium: 'Hindi',
      board: 'CBSE',
      type: 'Book'
    }
  ];
  states: any [];
  classes: any [];
  medium: any [];
  subjects: any [];
  noGroupContent: boolean = false;
  loginContent: boolean = true;
  groupCardContent: boolean = true;
  hideLoginContainer: boolean = true;
  CreateGroupRightPanel: boolean = false;
  showBoardSelectnModal;
  constructor() { }

  ngOnInit() {
    this.states = [  {name: 'Assam'}, {name: 'Andhra Pradesh'}, {name: 'Arunachal Pradesh'},
    {name: 'Bihar'}, {name: 'Chandigarh'}, {name: 'Chattisgarh'}, {name: 'Delhi'}, {name: 'Goa'},
    {name: 'Gujarat'}, {name: 'Harayana'}, {name: 'Himachal Pradesh'}, {name: 'Jammu And Kashmir'},
    {name: 'Jharkhand'}, {name: 'Karnataka'}, {name: 'Kerala'},  {name: 'Maharashtra'}, {name: 'Madhya Pradesh'},
    {name: 'Manipur'}, {name: 'Meghalaya'}, {name: 'Mizoram'}, {name: 'Nagaland'}, {name: 'Orissa'},
    {name: 'Punjab'}, {name: 'Rajasthan'}, {name: 'Sikkim'}, {name: 'Tamil Nadu'}, {name: 'Telangana'},
    {name: 'Tripura'}, {name: 'Uttarakhand'}, {name: 'Uttar Pradesh'}, {name: 'West Bengal'}];

   this.medium = [  {name: 'English Medium'}, {name: 'Hindi Medium'}, {name: 'Tamil Medium'},
    {name: 'Malayalam Medium'}, {name: 'Telugu Medium'}, {name: 'Kannada Medium'},
    {name: 'Bengali Medium'}, {name: 'Punjabi Medium'}, {name: 'Urdu Medium'}];

   this.classes = [  {name: 'Class 1'}, {name: 'Class 2'}, {name: 'Class 3'},
    {name: 'Class 4'}, {name: 'Class 5'}, {name: 'Class 6'}, {name: 'Class 7'}, {name: 'Class 8'},
    {name: 'Gujarat'}, {name: 'Harayana'}, {name: 'Himachal Pradesh'}, {name: 'Jammu And Kashmir'},
    {name: 'Class 9'}, {name: 'Class 10'}];

   this.subjects = [  {name: 'English'}, {name: 'Hindi'}, {name: 'Tamil'},
    {name: 'Malayalam'}, {name: 'Telugu'}, {name: 'Kannada Medium'},
    {name: 'Bengali'}, {name: 'Punjabi'}, {name: 'Urdu'}];
  }
  login() {
    this.hideLoginContainer = !this.hideLoginContainer;
    this.noGroupContent = true;
  }
  onMyGroups() {
    this.loginContent = !this.loginContent;
  }
  onCreateGroup() {
    this.groupCardContent = !this.groupCardContent ;
    this.noGroupContent = false;
    this.CreateGroupRightPanel = true;
  }
}
