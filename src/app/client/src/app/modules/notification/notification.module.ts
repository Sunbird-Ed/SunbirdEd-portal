import { forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v9';
import { InAppNotificationComponent } from './components/in-app-notification/in-app-notification.component';
import { SbNotificationModule } from 'sb-notification';
import { NotificationServiceImpl } from './services/notification/notification-service-impl';
import { SharedModule } from '@sunbird/shared';
@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    CommonConsumptionModule,
    SbNotificationModule,
    SharedModule
  ],
  declarations: [InAppNotificationComponent],
  exports: [InAppNotificationComponent],
  providers: [{ provide: 'SB_NOTIFICATION_SERVICE', useClass: forwardRef(() => NotificationServiceImpl) }]
})

export class NotificationModule {}
