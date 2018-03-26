import { CollectionEditorComponent } from './../core/components/collection-editor/collection-editor.component';
import { CreateCollectionComponent } from './../core/components/create-collection/create-collection.component';

import { CommunityListComponent } from './components/community-list/community-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'groups',
    component: CommunityListComponent
},
{
  path: 'collection',
  component: CreateCollectionComponent
  
},
{
  path: 'collection/editor',
  component: CollectionEditorComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityRoutingModule { }
