import { ConfigService, ResourceService } from './services';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [AppLoaderComponent],
  exports: [AppLoaderComponent],
  providers: [ResourceService, ConfigService]
})
export class SharedModule { }
