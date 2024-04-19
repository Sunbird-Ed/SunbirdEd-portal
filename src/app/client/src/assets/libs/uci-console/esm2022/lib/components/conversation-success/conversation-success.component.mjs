import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/common";
export class ConversationSuccessComponent {
    constructor(router, activatedRoute) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.text = '';
        this.botId = '';
    }
    ngOnInit() {
        this.text = this.activatedRoute.snapshot.queryParams.text || '';
        this.botId = this.activatedRoute.snapshot.queryParams.botId || '';
    }
    onCopy(id) {
        const val = document.getElementById(id).innerText;
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }
    onClose() {
        this.router.navigate(['/uci-admin']);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ConversationSuccessComponent, deps: [{ token: i1.Router }, { token: i1.ActivatedRoute }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: ConversationSuccessComponent, selector: "lib-conversation-success", ngImport: i0, template: "<div class=\"uci-container\">\n    <div class=\"twelve wide column center aligned mt-80\">\n        <div class=\"pt-0 d-flex flex-row justify-content-center\">\n            <div class=\"w-25-per text-center\" style=\"margin: auto;\">\n                <div class=\"text-center mb-20\">\n                    <img alt=\"Search Icon\" src=\"assets/uci-console/images/success.svg\">\n                </div>\n\n                <div class=\"text-center p-5\">\n                    Congratulations! You have successfully created a new conversation\n                </div>\n\n                <div class=\"text-center p-5\">\n                    Use the following URL to use DIKSHA bot:\n                    <strong><span id=\"copyUrl\">https://api.whatsapp.com/send?text={{text}}&phone=+912249757677</span></strong>\n                </div>\n\n                <div class=\"text-center p-5\" *ngIf=\"botId\">\n                    or share the following ID with DiKSHA team:\n                    <strong><span id=\"copyId\">{{botId}}</span></strong>\n                </div>\n\n                <div class=\"mt-20\">\n                    <button class=\"sb-btn sb-btn-normal sb-btn-primary mr-10\" (click)=\"onCopy('copyUrl')\">\n                        Copy URL\n                    </button>\n                    <button class=\"sb-btn sb-btn-normal sb-btn-primary mr-10\" (click)=\"onCopy('copyId')\">\n                        Copy ID\n                    </button>\n                    <button class=\"sb-btn sb-btn-normal sb-btn-outline-primary\" (click)=\"onClose()\">\n                        Close\n                    </button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n</div>\n", styles: [""], dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ConversationSuccessComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-conversation-success', template: "<div class=\"uci-container\">\n    <div class=\"twelve wide column center aligned mt-80\">\n        <div class=\"pt-0 d-flex flex-row justify-content-center\">\n            <div class=\"w-25-per text-center\" style=\"margin: auto;\">\n                <div class=\"text-center mb-20\">\n                    <img alt=\"Search Icon\" src=\"assets/uci-console/images/success.svg\">\n                </div>\n\n                <div class=\"text-center p-5\">\n                    Congratulations! You have successfully created a new conversation\n                </div>\n\n                <div class=\"text-center p-5\">\n                    Use the following URL to use DIKSHA bot:\n                    <strong><span id=\"copyUrl\">https://api.whatsapp.com/send?text={{text}}&phone=+912249757677</span></strong>\n                </div>\n\n                <div class=\"text-center p-5\" *ngIf=\"botId\">\n                    or share the following ID with DiKSHA team:\n                    <strong><span id=\"copyId\">{{botId}}</span></strong>\n                </div>\n\n                <div class=\"mt-20\">\n                    <button class=\"sb-btn sb-btn-normal sb-btn-primary mr-10\" (click)=\"onCopy('copyUrl')\">\n                        Copy URL\n                    </button>\n                    <button class=\"sb-btn sb-btn-normal sb-btn-primary mr-10\" (click)=\"onCopy('copyId')\">\n                        Copy ID\n                    </button>\n                    <button class=\"sb-btn sb-btn-normal sb-btn-outline-primary\" (click)=\"onClose()\">\n                        Close\n                    </button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i1.Router }, { type: i1.ActivatedRoute }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVyc2F0aW9uLXN1Y2Nlc3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdWNpLWNvbnNvbGUvc3JjL2xpYi9jb21wb25lbnRzL2NvbnZlcnNhdGlvbi1zdWNjZXNzL2NvbnZlcnNhdGlvbi1zdWNjZXNzLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3VjaS1jb25zb2xlL3NyYy9saWIvY29tcG9uZW50cy9jb252ZXJzYXRpb24tc3VjY2Vzcy9jb252ZXJzYXRpb24tc3VjY2Vzcy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFTLE1BQU0sZUFBZSxDQUFDOzs7O0FBUWhELE1BQU0sT0FBTyw0QkFBNEI7SUFJckMsWUFBb0IsTUFBYyxFQUFVLGNBQThCO1FBQXRELFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFIMUUsU0FBSSxHQUFHLEVBQUUsQ0FBQztRQUNWLFVBQUssR0FBRyxFQUFFLENBQUM7SUFHWCxDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7UUFDaEUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztJQUN0RSxDQUFDO0lBRUQsTUFBTSxDQUFDLEVBQUU7UUFDTCxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNsRCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDeEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUMzQixNQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUNuQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEIsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsT0FBTztRQUNILElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDOytHQTdCUSw0QkFBNEI7bUdBQTVCLDRCQUE0QixnRUNSekMsNHFEQXNDQTs7NEZEOUJhLDRCQUE0QjtrQkFMeEMsU0FBUzsrQkFDSSwwQkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QWN0aXZhdGVkUm91dGUsIFJvdXRlcn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdsaWItY29udmVyc2F0aW9uLXN1Y2Nlc3MnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9jb252ZXJzYXRpb24tc3VjY2Vzcy5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vY29udmVyc2F0aW9uLXN1Y2Nlc3MuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIENvbnZlcnNhdGlvblN1Y2Nlc3NDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHRleHQgPSAnJztcbiAgICBib3RJZCA9ICcnO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGUpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy5hY3RpdmF0ZWRSb3V0ZS5zbmFwc2hvdC5xdWVyeVBhcmFtcy50ZXh0IHx8ICcnO1xuICAgICAgICB0aGlzLmJvdElkID0gdGhpcy5hY3RpdmF0ZWRSb3V0ZS5zbmFwc2hvdC5xdWVyeVBhcmFtcy5ib3RJZCB8fCAnJztcbiAgICB9XG5cbiAgICBvbkNvcHkoaWQpIHtcbiAgICAgICAgY29uc3QgdmFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpLmlubmVyVGV4dDtcbiAgICAgICAgY29uc3Qgc2VsQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICAgICAgc2VsQm94LnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgICAgICAgc2VsQm94LnN0eWxlLmxlZnQgPSAnMCc7XG4gICAgICAgIHNlbEJveC5zdHlsZS50b3AgPSAnMCc7XG4gICAgICAgIHNlbEJveC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgICAgICBzZWxCb3gudmFsdWUgPSB2YWw7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2VsQm94KTtcbiAgICAgICAgc2VsQm94LmZvY3VzKCk7XG4gICAgICAgIHNlbEJveC5zZWxlY3QoKTtcbiAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzZWxCb3gpO1xuICAgIH1cblxuICAgIG9uQ2xvc2UoKSB7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnL3VjaS1hZG1pbiddKTtcbiAgICB9XG5cbn1cbiIsIjxkaXYgY2xhc3M9XCJ1Y2ktY29udGFpbmVyXCI+XG4gICAgPGRpdiBjbGFzcz1cInR3ZWx2ZSB3aWRlIGNvbHVtbiBjZW50ZXIgYWxpZ25lZCBtdC04MFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicHQtMCBkLWZsZXggZmxleC1yb3cganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInctMjUtcGVyIHRleHQtY2VudGVyXCIgc3R5bGU9XCJtYXJnaW46IGF1dG87XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyIG1iLTIwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgYWx0PVwiU2VhcmNoIEljb25cIiBzcmM9XCJhc3NldHMvdWNpLWNvbnNvbGUvaW1hZ2VzL3N1Y2Nlc3Muc3ZnXCI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXIgcC01XCI+XG4gICAgICAgICAgICAgICAgICAgIENvbmdyYXR1bGF0aW9ucyEgWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGNyZWF0ZWQgYSBuZXcgY29udmVyc2F0aW9uXG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXIgcC01XCI+XG4gICAgICAgICAgICAgICAgICAgIFVzZSB0aGUgZm9sbG93aW5nIFVSTCB0byB1c2UgRElLU0hBIGJvdDpcbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz48c3BhbiBpZD1cImNvcHlVcmxcIj5odHRwczovL2FwaS53aGF0c2FwcC5jb20vc2VuZD90ZXh0PXt7dGV4dH19JnBob25lPSs5MTIyNDk3NTc2Nzc8L3NwYW4+PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXIgcC01XCIgKm5nSWY9XCJib3RJZFwiPlxuICAgICAgICAgICAgICAgICAgICBvciBzaGFyZSB0aGUgZm9sbG93aW5nIElEIHdpdGggRGlLU0hBIHRlYW06XG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+PHNwYW4gaWQ9XCJjb3B5SWRcIj57e2JvdElkfX08L3NwYW4+PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibXQtMjBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInNiLWJ0biBzYi1idG4tbm9ybWFsIHNiLWJ0bi1wcmltYXJ5IG1yLTEwXCIgKGNsaWNrKT1cIm9uQ29weSgnY29weVVybCcpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBDb3B5IFVSTFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInNiLWJ0biBzYi1idG4tbm9ybWFsIHNiLWJ0bi1wcmltYXJ5IG1yLTEwXCIgKGNsaWNrKT1cIm9uQ29weSgnY29weUlkJylcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIENvcHkgSURcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJzYi1idG4gc2ItYnRuLW5vcm1hbCBzYi1idG4tb3V0bGluZS1wcmltYXJ5XCIgKGNsaWNrKT1cIm9uQ2xvc2UoKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgQ2xvc2VcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbjwvZGl2PlxuIl19