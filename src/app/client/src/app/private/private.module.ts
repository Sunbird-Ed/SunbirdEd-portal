import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import { DashboardModule } from '@sunbird/dashboard';
import { PluginModules } from './../framework.config';

@NgModule({
  imports: [
    CommonModule,
    DashboardModule,
    ...PluginModules,
    PrivateRoutingModule
  ],
  declarations: []
})
export class PrivateModule { }
