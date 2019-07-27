import { Injectable } from '@angular/core';
import { TenantService } from '@sunbird/core';
import { first, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecoverAccountService {

  tenantInfo: any;
  constructor(private tenantService: TenantService) {
    this.setTenantInfo();
  }
  private setTenantInfo() {
    this.tenantService.tenantData$.pipe(first()).subscribe(data => {
      if (!data.err) {
        this.tenantInfo = {
          logo: data.tenantData.logo,
          tenantName: data.tenantData.titleName
        };
      }
    });
  }
}
