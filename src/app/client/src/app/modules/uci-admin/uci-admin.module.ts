import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UciComponent } from './components/uci/uci.component';
import { UciAdminRoutingModule } from './uci-admin-routing.module';
import {UciModule} from '@samagra-x/uci-console';
import {UciService} from '@samagra-x/uci-console/lib/services/uci.service';


@NgModule({
  declarations: [UciComponent],
  imports: [
    UciAdminRoutingModule,
    UciModule
  ]
})
export class UciAdminModule {
  static forRoot(): ModuleWithProviders<UciModule> {
    return {
      ngModule: UciModule,
      providers: [UciService]
    };
  }
}
