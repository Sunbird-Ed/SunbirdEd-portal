import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicCollectionPlayerComponent, PublicContentPlayerComponent } from './components';
const routes: Routes = [
    {
        path: 'content/:contentId', component: PublicContentPlayerComponent, data: {
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
        path: 'collection/:collectionId', component: PublicCollectionPlayerComponent, data: {
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
