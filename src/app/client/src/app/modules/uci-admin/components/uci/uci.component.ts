import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from '../../../core/services/user/user.service';
import {ConfigService} from '@sunbird/shared';

@Component({
  selector: 'app-uci',
  templateUrl: './uci.component.html',
  styleUrls: ['./uci.component.scss']
})
export class UciComponent implements OnInit {
  public userProfile: any;
  public url;

  constructor(public userService: UserService,
              private config: ConfigService) { }

  ngOnInit(): void {
    // this.url = this.config.urlConFig.URLS.PUBLIC_PREFIX;
    this.url = 'https://uci-server2.ngrok.samagra.io';
    this.userService.userData$.pipe(first()).subscribe(async (user) => {
      if (user && user.userProfile) {
        this.userProfile = user.userProfile;
      }
    });
  }

}
