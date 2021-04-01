import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-guest-profile',
  templateUrl: './guest-profile.component.html',
  styleUrls: ['./guest-profile.component.scss']
})
export class GuestProfileComponent implements OnInit {
  avatarStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #fff',
    boxShadow: '0 0 6px 0 rgba(0,0,0,0.38)',
    borderRadius: '50%',
    color: '#9017FF',
    fontWeight: '700',
    fontFamily: 'inherit'
  };
  userName = 'Guest User';
  constructor(
    public resourceService: ResourceService
  ) { }

  ngOnInit() {
  }

}
