import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElectronDialogService } from './electron-dialog.service';
import {SharedModule} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';

describe('ElectronDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      providers: []
    });
  });
  it('should be created', () => {
    const service: ElectronDialogService = TestBed.get(ElectronDialogService);
    expect(service).toBeTruthy();
  });
});
