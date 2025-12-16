// Angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Modules
import { SuiModule } from '@project-sunbird/ng2-semantic-ui';
import { TelemetryModule } from '@sunbird/telemetry';
// SB core and shared services
import { SharedModule } from '@sunbird/shared';
import { DashletModule } from '@project-sunbird/sb-dashlet';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Import only the components that are SHARED with other modules (not used in routing)
import { DataTableComponent } from './components/data-table/data-table.component';
import { FilterComponent } from './components/filter/filter.component';

/**
 * DashboardSharedModule
 * 
 * This module contains components that are shared between DashboardModule and other modules
 * (like program-dashboard). It helps prevent circular dependency issues when both modules
 * are lazy-loaded.
 * 
 * NOTE: CourseProgressComponent is NOT here because it's used in DashboardRoutingModule.
 * Only components that are NOT used in routes can be in this shared module.
 * 
 * Components in this module:
 * - DataTableComponent
 * - FilterComponent
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModule,
    SharedModule,
    TelemetryModule,
    DashletModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatExpansionModule,
    SharedFeatureModule,
    MatAutocompleteModule
  ],
  declarations: [
    DataTableComponent,
    FilterComponent
  ],
  exports: [
    DataTableComponent,
    FilterComponent
  ]
})
export class DashboardSharedModule { }
