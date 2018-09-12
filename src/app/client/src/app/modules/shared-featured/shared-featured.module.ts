import { SharedFeaturedRoutingModule } from './shared-featured-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewAllComponent } from './components';
import { SlickModule } from 'ngx-slick';
@NgModule({
  imports: [
    CommonModule,
    SharedFeaturedRoutingModule,
    SlickModule
  ],
  declarations: [ViewAllComponent]
})
export class SharedFeaturedModule { }
