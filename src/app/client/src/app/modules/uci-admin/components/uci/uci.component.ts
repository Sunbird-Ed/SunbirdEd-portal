import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {UserService} from '../../../core/services/user/user.service';
import {ConfigService, ResourceService} from '@sunbird/shared';

@Component({
  selector: 'app-uci',
  templateUrl: './uci.component.html',
  styleUrls: ['./uci.component.scss']
})
export class UciComponent implements OnInit {
  public userProfile: any;
  public url;
  public blobUrl;
  public uciBotPhoneNumber;

  constructor(public userService: UserService,
              private config: ConfigService,
              public resourceService: ResourceService) {
    this.blobUrl = (<HTMLInputElement>document.getElementById('blobUrl'))
      ? (<HTMLInputElement>document.getElementById('blobUrl')).value : '';
    this.uciBotPhoneNumber = (<HTMLInputElement>document.getElementById('uciBotPhoneNumber'))
      ? (<HTMLInputElement>document.getElementById('uciBotPhoneNumber')).value : '';
  }

  ngOnInit(): void {
    this.url = this.config.urlConFig.URLS.UCI;
    this.userService.userData$.pipe(first()).subscribe((user) => {
      if (user && user.userProfile) {
        this.userProfile = user.userProfile;
      }
    });
  }

}
