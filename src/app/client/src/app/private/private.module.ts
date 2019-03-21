import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import { PluginModules } from './../framework.config';

@NgModule({
  imports: [
    CommonModule,
    ...PluginModules,
    PrivateRoutingModule
  ],
  declarations: []
})
export class PrivateModule { }
