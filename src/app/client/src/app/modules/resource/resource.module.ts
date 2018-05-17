import { ResourceRoutingModule } from './resource-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceComponent, CollectionPlayerComponent, ContentPlayerComponent } from './components';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@sunbird/core';
import { DiscussionModule } from '@sunbird/discussion';
import { NotesModule } from '@sunbird/notes';
import { BadgingModule } from '@sunbird/badge';
@NgModule({
  imports: [
    CommonModule,
    ResourceRoutingModule,
    SharedModule,
    SuiModule,
    SlickModule,
    FormsModule,
    CoreModule,
    DiscussionModule,
    NotesModule,
    BadgingModule
  ],
  declarations: [ResourceComponent, CollectionPlayerComponent, ContentPlayerComponent]
})
export class ResourceModule { }
