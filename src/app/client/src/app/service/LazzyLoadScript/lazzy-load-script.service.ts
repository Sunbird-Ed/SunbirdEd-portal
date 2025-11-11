import { Injectable, Inject } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LazzyLoadScriptService {

  private cdnUrl = '';
  private _loadedLibraries: { [url: string]: ReplaySubject<void> } = {};

  public loadScript(url: string): Observable<any> {
    url = this.cdnUrl + url;
    if (this._loadedLibraries[url]) {
      return this._loadedLibraries[url].asObservable();
    }
    this._loadedLibraries[url] = new ReplaySubject();
    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = () => {
      this._loadedLibraries[url].next();
      this._loadedLibraries[url].complete();
    };
    this.document.body.appendChild(script);
    return this._loadedLibraries[url].asObservable();
  }

  constructor(@Inject(DOCUMENT) private readonly document: any) {
    const cdnWorking = (<HTMLInputElement>document.getElementById('cdnWorking'))
                          ? (<HTMLInputElement>document.getElementById('cdnWorking')).value : 'no';
      if (cdnWorking.toLowerCase() === 'yes') {
        this.cdnUrl = (<HTMLInputElement>document.getElementById('cdnUrl'))
                        ? (<HTMLInputElement>document.getElementById('cdnUrl')).value : '';
      }
  }
}
