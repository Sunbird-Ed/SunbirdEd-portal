import { ExploreRoutingModule } from './explore-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExploreContentComponent} from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgInviewModule } from 'angular-inport';
import { ExploreComponent } from './components/explore/explore.component';


@NgModule({
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    NgInviewModule,
    ExploreRoutingModule
  ],
  declarations: [ ExploreContentComponent, ExploreComponent]
})
export class ExploreModule { }
