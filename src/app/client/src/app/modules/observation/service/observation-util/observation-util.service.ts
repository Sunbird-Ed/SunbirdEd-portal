import { Injectable } from "@angular/core";
import { UserService } from "@sunbird/core";
import { IUserData, ConfigService } from "@sunbird/shared";
import { take } from "rxjs/operators";
import { KendraService } from "@sunbird/core";

@Injectable({
  providedIn: "root",
})

export class ObservationUtilService {
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

  getProfileData() {
    return this.userService.userData$
      .pipe(take(1))
      .toPromise()
      .then((profileData: IUserData) => {
        if (
          profileData &&
          profileData.userProfile &&
          profileData.userProfile["profileUserType"] &&
          profileData.userProfile["profileUserType"]["subType"] === null
        ) {
          return false;
        } else {
          return true;
        }
      })
      .catch((error) => {});
  }

  async getMandatoryEntities(): Promise<any> {
     const profile =JSON.parse(sessionStorage.getItem("CacheServiceuserProfile"));
     this.profile=profile.value;
     await this.getProfileDataList();
    return new Promise((resolve, reject) => {
      const config = {
        url:
          this.config.urlConFig.URLS.OBSERVATION
            .MANDATORY_ENTITY_TYPES_FOR_ROLES + `${this.dataParam.state}?role=${this.dataParam.role}`,
      };

      this.kendraService.get(config).subscribe((data: any) => {
        if (data.result && data.result.length) {
          this.requiredFields = data.result;
          let allFieldsPresent = true;
          for (const field of this.requiredFields) {
            const val = this.profile.userLocations.filter((element)=>{
              return element.type == field
            });
            if (!val) {
              allFieldsPresent = false;
              break
            }
          }
          if (!allFieldsPresent) {
            // this.openProfileUpdateAlert()
            resolve(false)
          } else {
            resolve(true);
          }
        } else {
          // this.openProfileUpdateAlert();
          resolve(false)
        }
      }, error => {
        resolve(false)
        // reject()
      })
    })
  }

  async getProfileInfo(): Promise<any> {
   
    return new Promise(async (resolve, reject) => {
      const profileData=await this.getProfileData();
      if(!profileData){
        resolve(false);
        return;
      }

      const mandatoryFields = await this.getMandatoryEntities();
      mandatoryFields ? resolve(true) : resolve(false);
    });

  }

  getProfileDataList(){
    return new Promise((resolve, reject) => {
    const profileData = JSON.parse(sessionStorage.getItem("CacheServiceuserProfile"));
    const obj = {}
    for (const location of profileData.value['userLocations']) {
      obj[location.type] = location.id
    }
    for (const org of profileData.value['organisations']) {
      if (org.isSchool) {
        obj['school'] = org.externalId;
      }
    }
    
    obj['role'] = profileData.value['profileUserType'] && profileData.value['profileUserType']['subType'] ? profileData.value['profileUserType']['subType'].toUpperCase() : null;
    this.dataParam=obj;
    resolve(obj);
  });
  }
  



}
