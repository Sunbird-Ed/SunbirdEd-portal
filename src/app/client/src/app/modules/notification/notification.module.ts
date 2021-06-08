import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { InAppNotificationComponent } from './components/in-app-notification/in-app-notification.component';
import { SbNotificationModule } from 'sb-notification';
import { NotificationServiceImpl } from './services/notification/notification-service-impl';

@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    CommonConsumptionModule,
    SbNotificationModule
  ],
  declarations: [InAppNotificationComponent],
  exports: [InAppNotificationComponent],
  providers: [{ provide: 'SB_NOTIFICATION_SERVICE', useClass: NotificationServiceImpl }]
})

export class NotificationModule {}
