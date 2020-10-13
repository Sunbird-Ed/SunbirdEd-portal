import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentPlayerComponent, CollectionPlayerComponent } from '@sunbird/shared-feature';

const routes: Routes = [
    {
        path: 'content/:contentId', component: ContentPlayerComponent, data: {
            // routeReuse: {
            //     reuse: true,
            //     path: '/play/content'
            //   },
            telemetry: {
                env: 'public', pageid: 'play-content', type: 'view', subtype: 'paginate'
            }
        }
    },
    {
        path: 'collection/:collectionId', component: CollectionPlayerComponent, data: {
            // routeReuse: {
            //     reuse: true,
            //     path: '/play/collection'
            //   },
            telemetry: {
                env: 'public', pageid: 'play-collection', type: 'view', subtype: 'paginate'
            }
        }
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlayerRoutingModule { }
