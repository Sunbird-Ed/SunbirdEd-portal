import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentPlayerComponent, CollectionPlayerComponent } from '@sunbird/shared-feature';
import { PendingchangesGuard } from './../../services';

const routes: Routes = [
    {
        path: 'content/:contentId', component: ContentPlayerComponent, data: {
            // routeReuse: {
            //     reuse: true,
            //     path: '/play/content'
            //   },
            menuBar: {
                visible: false
            },
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

            menuBar: {
                visible: false
            },
            telemetry: {
                env: 'public', pageid: 'play-collection', type: 'view', subtype: 'paginate'
            }
        }
    },
    {
        path: 'questionset/:contentId', component: ContentPlayerComponent, canDeactivate: [PendingchangesGuard],
        data: {

            menuBar: {
                visible: false
            },
            telemetry: {
                env: 'public', pageid: 'play-questionset', type: 'view', subtype: 'paginate'
            }
        }
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlayerRoutingModule { }
