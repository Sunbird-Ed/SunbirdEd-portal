import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservationRoutingModule } from './observation-routing.module';
import {ObservationDetailsComponent,ObservationListingComponent,AddEntityComponent} from './components';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { SuiModule } from 'ng2-semantic-ui/dist';
import {
  SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule
} from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { CsModule } from '@project-sunbird/client-services';
import { CsLibInitializerService } from '../../service/CsLibInitializer/cs-lib-initializer.service';


export const csUserServiceFactory = (csLibInitializerService: CsLibInitializerService) => {
  if (!CsModule.instance.isInitialised) {
    csLibInitializerService.initializeCs();
  }
  return CsModule.instance.userService;
};
export const csCourseServiceFactory = (csLibInitializerService: CsLibInitializerService) => {
  if (!CsModule.instance.isInitialised) {
    csLibInitializerService.initializeCs();
  }
  return CsModule.instance.courseService;
};
@NgModule({
  declarations: [ObservationListingComponent, ObservationDetailsComponent,AddEntityComponent],
  imports: [
    CommonModule,
    ObservationRoutingModule,
    SharedModule,
    CoreModule,
    FormsModule,
    SuiModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
    SuiProgressModule, SuiRatingModule, SuiCollapseModule,

  ],
  providers: [
    { provide: 'CS_USER_SERVICE', useFactory: csUserServiceFactory, deps: [CsLibInitializerService] },
    { provide: 'CS_COURSE_SERVICE', useFactory: csCourseServiceFactory, deps: [CsLibInitializerService] }
  ],
})
export class ObservationModule { }
