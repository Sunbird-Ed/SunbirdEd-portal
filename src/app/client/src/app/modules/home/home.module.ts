// Import modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Import services
import { CoreModule } from '@sunbird/core';
import { SharedModule} from '@sunbird/shared';
// Import component
import {
 HomeCalendarCardComponent, HomeFeedCardComponent, MainHomeComponent,
  ProfileCardComponent, HomeAnnouncementComponent, NotificationComponent
} from './component/index';
import { HomeAnnouncementService } from './service/index';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
@NgModule({
  imports: [
    SuiModule,
    CommonModule,
    HomeRoutingModule,
    SlickModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    NgInviewModule,
    TelemetryModule
  ],
  declarations: [
    ProfileCardComponent,
    MainHomeComponent,
    HomeFeedCardComponent,
    HomeCalendarCardComponent,
    HomeAnnouncementComponent,
    NotificationComponent,
  ],
  providers: [HomeAnnouncementService]
})
export class HomeModule {
}
