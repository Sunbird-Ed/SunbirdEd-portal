
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService , UserService , LearnerService , ResourceService , PermissionService} from './services';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: [],
  providers: [ConfigService , LearnerService , ResourceService, UserService , PermissionService]
})
export class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: [ConfigService , LearnerService , ResourceService, UserService , PermissionService]
    };
  }
}


