import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentPlayerComponent, CollectionPlayerComponent } from '@sunbird/shared-feature';
const telemetryEnv = 'library';

const routes: Routes = [
    {
        path: 'collection/:collectionId', component: CollectionPlayerComponent,
        data: {
            // routeReuse: {
            //     reuse: true,
            //     path: 'resources/play/collection'
            // },
            breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '' }],
            telemetry: { env: telemetryEnv, pageid: 'collection-player', type: 'play' }
        }
    }, {
        path: 'collection/:collectionId/:collectionStatus', component: CollectionPlayerComponent,
        data: {
            breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '' }],
            telemetry: { env: telemetryEnv, pageid: 'collection-player-unlisted', type: 'play' }
        }
    }, {
        path: 'content/:contentId', component: ContentPlayerComponent,
        data: {
            // routeReuse: {
            //     reuse: true,
            //     path: 'resources/play/content'
            // },
            telemetry: {
                env: telemetryEnv, pageid: 'content-player', type: 'play'
            }, breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '/resources' }]
        }
    }, {
        path: 'content/:contentId/:contentStatus', component: ContentPlayerComponent,
        data: {
            breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '' }],
            telemetry: { env: telemetryEnv, pageid: 'content-player-unlisted', type: 'play' }
        }
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlayerRoutingModule { }
