import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatLegacyChipsModule as MatChipsModule } from "@angular/material/legacy-chips";
import { MatLegacyListModule as MatListModule } from "@angular/material/legacy-list";
import { MatSelectModule } from "@angular/material/select";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatLegacyProgressBarModule as MatProgressBarModule} from '@angular/material/legacy-progress-bar';
import {MatLegacyRadioModule as MatRadioModule} from '@angular/material/legacy-radio';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [],
    exports: [MatTooltipModule, MatTabsModule, MatDialogModule,
        MatAutocompleteModule, MatFormFieldModule, MatInputModule,MatChipsModule, MatIconModule, MatSelectModule, MatListModule,
        MatButtonModule, MatCheckboxModule, MatExpansionModule, MatSlideToggleModule, MatDatepickerModule, MatNativeDateModule, MatProgressBarModule, MatRadioModule]
})
export class MaterialModule { }
