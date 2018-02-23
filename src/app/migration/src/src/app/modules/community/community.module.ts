import { CommunityListComponent } from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@core';

import { CommunityRoutingModule } from './community-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CommunityRoutingModule,
    CoreModule
  ],
  declarations: [CommunityListComponent]
})
export class CommunityModule { }
