import { ResourceRoutingModule } from './resource-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceComponent } from './components/index';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    ResourceRoutingModule,
    SharedModule,
    SuiModule,
    SlickModule,
    FormsModule
  ],
  declarations: [ResourceComponent]
})
export class ResourceModule { }
