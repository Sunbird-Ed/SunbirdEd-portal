import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { QumlPlayerService } from './quml-player.service';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';

describe('QumlPlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [CoreModule, SharedModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
    providers: [QumlPlayerService, CsLibInitializerService],
  }));

  it('should be created', () => {
    const service: QumlPlayerService = TestBed.get(QumlPlayerService);
    expect(service).toBeTruthy();
  });
});
