import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatChipsModule } from "@angular/material/chips";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRadioModule} from '@angular/material/radio';


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
