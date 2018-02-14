import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css']
})
export class ProfileHeaderComponent implements OnInit {
  @Input() userProfile:any
  avator: string = "";
  constructor() { }

  ngOnInit() {
    this.avator= this.userProfile.avator;
  }

}
