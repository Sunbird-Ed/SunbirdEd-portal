import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Import the Ask components
import { AskComponent } from './ask.component';
import { AskResultsComponent } from './components/ask-results/ask-results.component';

// Import shared modules
import { SharedModule } from '../shared';
import { TelemetryModule } from '../telemetry';
import { CoreModule } from '../core';

// Define routes for the Ask module
const routes: Routes = [
  {
    path: '',
    component: AskComponent,
    data: {
      telemetry: {
        env: 'ask',
        pageid: 'ask-page',
        type: 'view',
        subtype: 'paginate'
      },
      menuBar: {
        visible: true
      }
    }
  }
];

/**
 * AskModule - Module for the Ask functionality
 * This module provides the Ask component, results display, and routing configuration
 */
@NgModule({
  declarations: [
    AskComponent,
    AskResultsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    TelemetryModule,
    CoreModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    AskComponent,
    AskResultsComponent
  ]
})
export class AskModule { }
