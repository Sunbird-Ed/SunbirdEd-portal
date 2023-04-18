import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { SuiModalModule } from 'ng2-semantic-ui-v9';
import { CommonModule } from '@angular/common';
import { CoreModule, SessionExpiryInterceptor } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { BootstrapFramework, WebExtensionModule } from '@project-sunbird/web-extensions';
import { WebExtensionsConfig } from './framework.config';
import { CacheService } from '../app/modules/shared/services/cache-service/cache.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PluginModules } from './framework.config';
import {ChatLibModule, ChatLibService} from '@project-sunbird/chatbot-client';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './service/CustomRouteReuseStrategy/CustomRouteReuseStrategy';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateStore } from '@ngx-translate/core';
import { SbSearchFilterModule } from '@project-sunbird/common-form-elements-full';
import { UserOnboardingModule} from '../app/modules/user-onboarding';
import { MatStepperModule} from '@angular/material/stepper';
import { CdkStepperModule} from '@angular/cdk/stepper';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserAnimationsModule,
        CoreModule,
        CommonModule,
        HttpClientModule,
        SuiModalModule,
        SharedModule.forRoot(),
        WebExtensionModule.forRoot(),
        TelemetryModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        SbSearchFilterModule.forRoot('web'),
        ChatLibModule,
        SharedFeatureModule,
        UserOnboardingModule,
        MatStepperModule,
        CdkStepperModule,
        ...PluginModules,
        // ngx-translate and the loader module
        HttpClientModule,
        AppRoutingModule // don't add any module below this because it contains wildcard route
    ],
    bootstrap: [AppComponent],
    providers: [
        CacheService,
        ChatLibService,
        TranslateStore,
        DeviceDetectorService,
        { provide: HTTP_INTERCEPTORS, useClass: SessionExpiryInterceptor, multi: true },
        { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
    ],
})
export class AppModule {
  constructor(bootstrapFramework: BootstrapFramework) {
    bootstrapFramework.initialize(WebExtensionsConfig);
  }
}
// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/resourcebundles/v1/readLang/', ' ');
}
