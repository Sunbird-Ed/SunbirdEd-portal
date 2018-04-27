import { PermissionDirective } from './directives';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
import {
  UserService, LearnerService, PermissionService, AnnouncementService, ConceptPickerService,
  BadgesService, ContentService, CoursesService, PageApiService, TelemetryService,
  TELEMETRY_PROVIDER, TenantService, FrameworkService, FormService
} from './services';
import { MainHeaderComponent, MainMenuComponent, SearchComponent,  ConceptPickerComponent, DataDrivenFilterComponent } from './components';
import { AuthGuard } from './guard/auth-gard.service';
import { CacheService } from 'ng2-cache-service';
@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [MainHeaderComponent, MainMenuComponent, SearchComponent, PermissionDirective, ConceptPickerComponent,
     DataDrivenFilterComponent],
  exports: [MainHeaderComponent, PermissionDirective, ConceptPickerComponent, DataDrivenFilterComponent],
  providers: [
    LearnerService, UserService, TenantService,
    PermissionService, AnnouncementService, BadgesService, ContentService, CoursesService, PageApiService,
    AuthGuard, TelemetryService, FrameworkService, FormService, CacheService,
     { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry}, ConceptPickerService]
})
export class CoreModule {
}
