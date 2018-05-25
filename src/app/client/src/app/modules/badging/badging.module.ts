import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { ContentBadgeComponent } from './components';
import { ContentBadgeService } from './services';
@NgModule({
    imports: [
        CommonModule,
        SuiModule,
        SharedModule
    ],
    declarations: [ContentBadgeComponent],
    exports: [ContentBadgeComponent],
    providers: [ContentBadgeService]
})
export class BadgingModule {

}
