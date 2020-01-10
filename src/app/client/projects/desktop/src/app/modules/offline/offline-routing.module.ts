import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowseComponent, OfflineHelpCenterComponent, LibraryComponent, DesktopExploreContentComponent,
    SearchComponent, ViewMoreComponent } from './components';

const routes: Routes = [
    {
        path: 'browse', component: BrowseComponent, data: {
            telemetry: {
                env: 'browse', pageid: 'browse', type: 'view'
            },
            softConstraints: { badgeAssertions: 98, board: 99, channel: 100 }
        }
    },
    {
        path: 'help-center', component: OfflineHelpCenterComponent, data: {
            telemetry: {
                env: 'help', pageid: 'help', type: 'view'
            }
        }
    },
    {
        path: 'search', component: SearchComponent, data: {
            telemetry: {
                env: 'search', pageid: 'search', type: 'view', subtype: 'paginate'
            },
            softConstraints: { badgeAssertions: 98, board: 99, channel: 100 }
        }
    },
    {
        path: 'view-all', component: ViewMoreComponent,
        data: {
            telemetry: {
                env: 'library', pageid: 'view-all', type: 'view', subtype: 'paginate'
            },
            filterType: 'explore',
            softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
            applyMode: true
        }
    },
    {
        path: 'browse/view-more/:pageNumber', component: ViewMoreComponent, data: {
            telemetry: {
                env: 'search', pageid: 'view-more', type: 'view', subtype: 'paginate'
            },
            softConstraints: { badgeAssertions: 98, board: 99, channel: 100 }
        }
    },
    {
        path: 'view-more', component: ViewMoreComponent, data: {
            telemetry: {
                env: 'search', pageid: 'view-more', type: 'view', subtype: 'paginate'
            },
            softConstraints: { badgeAssertions: 98, board: 99, channel: 100 }
        }
    },
    {
        path: 'get', loadChildren: './../../../../../../src/app/modules/dial-code-search/dial-code-search.module#DialCodeSearchModule'
    },
    {
        path: 'browse/get',
        loadChildren: './../../../../../../src/app/modules/dial-code-search/dial-code-search.module#DialCodeSearchModule'
    },
    {
        path: '', component: LibraryComponent, data: {
            telemetry: {
                env: 'library', pageid: 'library', type: 'view'
            },
            softConstraints: { badgeAssertions: 98, board: 99, channel: 100 }
        }
    },
    {
        path: ':slug/explore', loadChildren: './../../../../../../src/app/modules/public/module/explore/explore.module#ExploreModule'
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OfflineRoutingModule { }
