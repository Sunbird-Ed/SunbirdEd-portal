import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-uci',
  templateUrl: './uci.component.html',
  styleUrls: ['./uci.component.scss']
})
export class UciComponent implements OnInit {

  public userProfile: any;
  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.userService.userData$.pipe(first()).subscribe(async (user) => {
      if (user && user.userProfile) {
        this.userProfile = user.userProfile;
        console.log(this.userProfile)
      }
    });
  }

}
