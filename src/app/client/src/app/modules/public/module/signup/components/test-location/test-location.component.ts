import { Component, OnInit } from '@angular/core';
import {Location as SbLocation} from '@project-sunbird/client-services/models/location';
import { SignupService } from './../../services';
import {ServerResponse, ResourceService, ToasterService} from '@sunbird/shared';
import * as _ from 'lodash';
import { LocationService } from '../../../../../../plugins/location';
@Component({
  selector: 'app-test-location',
  templateUrl: './test-location.component.html',
  styleUrls: ['./test-location.component.scss']
})
export class TestLocationComponent implements OnInit {

  constructor( public locationService: LocationService, public signupService: SignupService, private resourceService: ResourceService,
    private toasterService: ToasterService,) { }

  ngOnInit(): void {
    this.updateLocation();
  }

  updateLocation() {
    const createRequest = {"params":{"source":"portal","signupType":"self"},
    "request":{"firstName":"tbg","password":"Test@12345","dob":"2019","email":"tejaswinig111@yopmail.com",
    "emailVerified":true,"reqData":"{\"iv\":\"644e510950876b7850f67dfcebd72e53\",\"encryptedData\":\"aa58f3a1f3f5fc537db38eed602c08e69cb8664efcd0a198670652175d16dcb5f33c67a607d02216109ed9a772f4cc5666d470bcf9e21618c60db2991eae9742\"}"}};
    const startingForm = {"basicInfo":{"name":"tbg","yearOfBirth":"2019","isMinor":true},
    "onboardingInfo":{"persona":"teacher","children":{"persona":{"state":{"code":"28","name":"Andhra Pradesh","id":"0393395d-ea39-49e0-8324-313b4df4a550","type":"state"},
    "district":{"identifier":"640a1938-1f23-48f9-9e3b-75bc862b769d","code":"2822","name":"Ananthapuram","id":"640a1938-1f23-48f9-9e3b-75bc862b769d","type":"district","parentId":"0393395d-ea39-49e0-8324-313b4df4a550"},"block":{"identifier":"9525bce5-f91b-4d01-89a0-36acf76e0036","code":"282224","name":"Atmakur","id":"9525bce5-f91b-4d01-89a0-36acf76e0036","type":"block","parentId":"640a1938-1f23-48f9-9e3b-75bc862b769d"},"cluster":{"identifier":"bb8a385e-8fd0-4a07-8d85-0a2a2fe99719","code":"2822240002","name":"Zphs Atmakur","id":"bb8a385e-8fd0-4a07-8d85-0a2a2fe99719","type":"cluster","parentId":"9525bce5-f91b-4d01-89a0-36acf76e0036"},"school":{"code":"28222400403","parentId":"bb8a385e-8fd0-4a07-8d85-0a2a2fe99719","type":"school","name":"Mpps South Atmakur","id":"0127261026390016007274","identifier":"0127261026390016007274"}}}},"emailPassInfo":{"key":"tejaswinig111@yopmail.com","type":"email","templateId":"wardLoginOTP","password":"Test@12345"},"routeParams":{"client_id":"portal","state":"80018604-b58d-44cf-a441-30da3f90db15","redirect_uri":"https://dev.oci.diksha.gov.in/resources?board=CBSE&medium=English&gradeLevel=Class%202&&id=cisce_k-12&selectedTab=textbook&auth_callback=1","scope":"openid","response_type":"code","version":"4",
    "error_callback":"https://dev.oci.diksha.gov.in/auth/realms/sunbird/protocol/openid-connect/auth"}};
      const locationDetails: SbLocation[] = Object.keys(_.get(startingForm, 'onboardingInfo.children.persona'))
      .reduce<SbLocation[]>((acc, key) => {
        const locationDetail: SbLocation | null = _.get(startingForm, 'onboardingInfo.children.persona')[key];
        if (_.get(locationDetail, 'code')) {
          acc.push(locationDetail);
        }
        return acc;
      }, []);
      const userTypes = [{ type: 'teacher' }];
      const payload: any = {
          userId: "10cb52a9-8496-453c-9c1f-5d13cf31296b",
          profileLocation: locationDetails,
          profileUserTypes: userTypes,
          firstName: createRequest.request.firstName
        
      };
      console.log("payload---",payload);
      this.locationService.updateProfile(payload).toPromise()
        .then((res) => {
          console.log("locUpdate res---", JSON.stringify(res));
          // this.registerSubmit.emit(_.get(result, 'value'));
          this.toasterService.success(this.resourceService?.messages?.smsg?.m0057);
        }).catch((err) => {
          console.log("Error for location selection", err);
          this.toasterService.error(this.resourceService?.messages?.emsg?.m0005);
        });
  }

}
