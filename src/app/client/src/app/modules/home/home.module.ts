import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import {
  HomeCalendarCardComponent, HomeFeedCardComponent, MainHomeComponent, HomeAnnouncementComponent, NotificationComponent
} from './component';
import { HomeAnnouncementService } from './service/index';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import { AnnouncementModule } from '@sunbird/announcement';

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
    TelemetryModule,
    AnnouncementModule
  ],
  declarations: [
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
