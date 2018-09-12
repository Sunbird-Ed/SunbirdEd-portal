import { NgModule , ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewAllComponent } from './components';
import { SlickModule } from 'ngx-slick';
@NgModule({
  imports: [
    CommonModule,
    SlickModule
  ],
  declarations: [ViewAllComponent],
  exports: [ViewAllComponent]
})
export class SharedFeatureModule { }
