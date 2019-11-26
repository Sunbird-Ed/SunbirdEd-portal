import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowseComponent, OfflineHelpCenterComponent, LibraryComponent, DesktopViewAllComponent } from './components';
import { ViewAllComponent } from '@sunbird/shared-feature';
import { ExploreContentComponent } from './../../../../../../src/app/modules/public/module/explore';
import { DesktopExploreContentComponent } from './components/desktop-explore-content/desktop-explore-content.component';

const routes: Routes = [
    {
        path: 'browse', component: BrowseComponent, data: {
            // path: 'browse', component: TestComponent, data: {
            telemetry: {
                env: 'offline', pageid: 'browse', type: 'view'
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
        // path: 'browse/:pageNumber', component: ExploreContentComponent, data: {
        path: 'browse/:pageNumber', component: DesktopExploreContentComponent, data: {
            telemetry: {
                env: 'offline', pageid: 'browse-search', type: 'view', subtype: 'paginate'
            },
            softConstraints: { badgeAssertions: 98, board: 99, channel: 100 }
        }
    },
    {
        // path: 'browse/view-all/:section/:pageNumber', component: ViewAllComponent,
        path: 'browse/view-all/:section/:pageNumber', component: DesktopViewAllComponent,
        data: {
            telemetry: {
                env: 'offline', pageid: 'view-all', type: 'view', subtype: 'paginate'
            },
            filterType: 'explore',
            softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
            applyMode: true
        }
    },
    {
        // path: 'search/:pageNumber', component: ExploreContentComponent, data: {
        path: 'search/:pageNumber', component: DesktopExploreContentComponent, data: {
            telemetry: {
                env: 'offline', pageid: 'library-search', type: 'view', subtype: 'paginate'
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
        // path: '', loadChildren: './../../../../../../src/app/modules/public/module/explore/explore.module#ExploreModule'
        path: '', component: LibraryComponent
    },
    {
        path: ':slug/explore', loadChildren: './../../../../../../src/app/modules/public/module/explore/explore.module#ExploreModule'
    },
    {
        path: 'play', loadChildren: './../../../../../../src/app/modules/public/module/player/player.module#PlayerModule'
    },
    {
        path: 'browse/play', loadChildren: './../../../../../../src/app/modules/public/module/player/player.module#PlayerModule'
    }];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OfflineRoutingModule { }

