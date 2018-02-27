import { CommunityListComponent } from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CommunityRoutingModule,
  ],
  declarations: [CommunityListComponent]
})
export class CommunityModule { }
