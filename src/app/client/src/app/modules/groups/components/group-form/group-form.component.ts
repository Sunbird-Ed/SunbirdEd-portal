import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
  showBoardSelectnModal;
  states: any [];
  classes: any [];
  medium: any [];
  subjects: any [];
  constructor() { }

  ngOnInit() {
    this.states = [  {name: 'Assam'}, {name: 'Andhra Pradesh'}, {name: 'Arunachal Pradesh'},
    {name: 'Bihar'}, {name: 'Chandigarh'}, {name: 'Chattisgarh'}, {name: 'Delhi'}, {name: 'Goa'},
    {name: 'Gujarat'}, {name: 'Harayana'}, {name: 'Himachal Pradesh'}, {name: 'Jammu And Kashmir'},
    {name: 'Jharkhand'}, {name: 'Karnataka'}, {name: 'Kerala'},  {name: 'Maharashtra'}, {name: 'Madhya Pradesh'}];

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

}
