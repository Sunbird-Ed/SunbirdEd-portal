import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
@NgModule({
  imports: [MatCheckboxModule,
    MatSidenavModule,
    MatButtonModule,
    MatTreeModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonToggleModule
  ],
  exports: [MatCheckboxModule,
    MatSidenavModule,
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonToggleModule
  ],
})

export class MaterialUi {
}
