import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';

import { CsModule } from '@project-sunbird/client-services';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { CsLibInitializerService } from '../../service/CsLibInitializer/cs-lib-initializer.service';

import { InAppNotificationComponent } from './components/in-app-notification/in-app-notification.component';
import { UserService } from '../core/services/user/user.service';

export const csUserServiceFactory = (csLibInitializerService: CsLibInitializerService) => {
  if (!CsModule.instance.isInitialised) {
    csLibInitializerService.initializeCs();
  }
  return CsModule.instance.userService;
};

@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    CommonConsumptionModule
  ],
  declarations: [InAppNotificationComponent],
  exports: [InAppNotificationComponent],
  providers: [{ provide: 'CS_USER_SERVICE', useFactory: csUserServiceFactory, deps: [CsLibInitializerService] }]
})

export class NotificationModule {}
