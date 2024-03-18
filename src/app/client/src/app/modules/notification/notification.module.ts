import { forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { InAppNotificationComponent } from './components/in-app-notification/in-app-notification.component';
import { SbNotificationModule } from '@project-sunbird/sb-notification';
import { NotificationServiceImpl } from './services/notification/notification-service-impl';
import { SharedModule } from '../../modules/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    CommonConsumptionModule,
    SbNotificationModule,
    SharedModule
  ],
  declarations: [InAppNotificationComponent],
  exports: [InAppNotificationComponent],
  providers: [{ provide: 'SB_NOTIFICATION_SERVICE', useClass: forwardRef(() => NotificationServiceImpl) }]
})

export class NotificationModule {}
