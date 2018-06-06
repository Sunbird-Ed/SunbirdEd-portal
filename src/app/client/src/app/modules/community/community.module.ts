import { CommunityListComponent } from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunbird/shared';
import { CommunityRoutingModule } from './community-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CommunityRoutingModule,
    SharedModule
  ],
  declarations: [CommunityListComponent]
})
export class CommunityModule { }
