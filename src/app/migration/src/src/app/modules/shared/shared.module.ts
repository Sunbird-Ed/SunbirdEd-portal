import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';
import { PermissionDirective } from './directives/permission/permission.directive';
import { AnnouncementInboxCardComponent } from './components/announcement-inbox-card/announcement-inbox-card.component';
import { DateFormatPipe } from './pipes/date-format/date-format.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [AppLoaderComponent, PermissionDirective, AnnouncementInboxCardComponent, DateFormatPipe],
  exports: [AppLoaderComponent, PermissionDirective, AnnouncementInboxCardComponent, DateFormatPipe],
  providers: []
})
export class SharedModule { }
