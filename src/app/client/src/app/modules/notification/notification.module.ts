import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { InAppNotificationComponent } from './components/in-app-notification/in-app-notification.component';
import { NotificationModule as SbNotificationModule } from 'notification';

@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    CommonConsumptionModule,
    SbNotificationModule
  ],
  declarations: [InAppNotificationComponent],
  exports: [InAppNotificationComponent]
})

export class NotificationModule {}
