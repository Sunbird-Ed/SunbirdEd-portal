import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { InAppNotificationComponent } from './components/in-app-notification/in-app-notification.component';
import { NotificationService } from './services/notification/notification.service';

@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    CommonConsumptionModule
  ],
  declarations: [InAppNotificationComponent],
  exports: [InAppNotificationComponent],
  providers: [NotificationService]
})

export class NotificationModule {}
