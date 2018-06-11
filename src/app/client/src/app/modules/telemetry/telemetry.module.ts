import { TelemetryService } from './services';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryInteractDirective,  TelemetryStartDirective, TelemetryEndDirective, TelemetryImpressionDirective,
  TelemetryShareDirective, TelemetryErrorDirective } from './directives';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TelemetryInteractDirective, TelemetryStartDirective, TelemetryEndDirective,
     TelemetryImpressionDirective, TelemetryShareDirective, TelemetryErrorDirective],
  exports: [TelemetryInteractDirective, TelemetryStartDirective, TelemetryEndDirective,
    TelemetryImpressionDirective, TelemetryShareDirective, TelemetryErrorDirective]
})
export class TelemetryModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TelemetryModule,
      providers: [TelemetryService]
    };
  }
}
