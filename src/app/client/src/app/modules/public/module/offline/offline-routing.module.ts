import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LibraryComponent } from './components';

const routes: Routes = [
    {
        path: '', component: LibraryComponent, data: {
            telemetry: {
                env: 'library', pageid: 'library', type: 'view'
            },
            softConstraints: { badgeAssertions: 98, board: 99, channel: 100 }
        }
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OfflineRoutingModule { }
