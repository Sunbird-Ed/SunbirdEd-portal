import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from '@sunbird/profile';
import { ConfigService, ResourceService } from '@sunbird/shared';

@Component({
    selector: 'app-year-of-birth',
    templateUrl: './year-of-birth.component.html',
    styleUrls: ['./year-of-birth.component.scss']
})
export class YearOfBirthComponent implements OnInit {
    selectedYearOfBirth: number;
    birthYearOptions: Array<number> = [];
    showYearOfBirthPopup = false;
    @ViewChild('modal', { static: false }) modal;

    constructor(
        private profileService: ProfileService,
        private configService: ConfigService,
        public resourceService: ResourceService
    ) { }
    ngOnInit() {
        this.initiateYearSelector();
    }

    submitYearOfBirth() {
        if (this.selectedYearOfBirth) {
            const req = { dob: this.selectedYearOfBirth.toString() };
            this.profileService.updateProfile(req).subscribe();
            this.modal.deny();
        }
    }

    initiateYearSelector() {
        const endYear = new Date().getFullYear();
        const startYear = endYear - this.configService.constants.SIGN_UP.MAX_YEARS;
        for (let year = endYear; year > startYear; year--) {
            this.birthYearOptions.push(year);
        }
    }

    changeBirthYear(year) {
        this.selectedYearOfBirth = year;
    }
}
