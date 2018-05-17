import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { ContentBadgeComponent } from './components';
@NgModule({
    imports: [
        CommonModule,
        SuiModule,
        SharedModule
    ],
    declarations: [ContentBadgeComponent],
    exports: [ContentBadgeComponent],
    providers: []
})
export class ContentBadgeModule {

}
