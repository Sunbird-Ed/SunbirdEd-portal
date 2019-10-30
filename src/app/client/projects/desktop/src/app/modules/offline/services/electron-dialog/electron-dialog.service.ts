import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { DataService } from '@sunbird/core';

@Injectable({
  providedIn: 'root'
})
export class ElectronDialogService extends DataService {

  constructor(public http: HttpClient, public configService: ConfigService) {
    super(http);
    this.baseUrl = this.configService.urlConFig.URLS.ELECTRON_DIALOG_PREFIX;
  }
  showContentImportDialog() {
    this.get({url : this.configService.urlConFig.URLS.ELECTRON_DIALOG.CONTENT_IMPORT}).subscribe(data => {
      console.log('import dialog box opened');
    }, error => {
      console.log('error while showing import dialog box');
    });
  }
}
