import { Injectable } from "@angular/core";
import { UserService } from "@sunbird/core";
import { IUserData, ConfigService } from "@sunbird/shared";
import { take } from "rxjs/operators";
import { KendraService } from "@sunbird/core";

@Injectable({
  providedIn: "root",
})

export class programManagerService {
  config;
  requiredFields;
  profile:any;
  dataParam:any;
  constructor(
    public userService: UserService,
    config: ConfigService,
    private kendraService: KendraService
  ) {
    this.config = config;
  }


  getProramList(){

    const config = {
      url:
        this.config.urlConFig.URLS.KENDRS
          .ML_ROLES
    };
    return this.kendraService.get(config);

  }

}