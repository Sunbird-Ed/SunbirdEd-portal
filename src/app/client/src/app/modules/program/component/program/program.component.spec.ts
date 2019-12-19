import { async, TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { ProgramComponent } from './program.component';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';



describe('ProgramComponent', () => {
  let component: ProgramComponent;
  let fixture: ComponentFixture<ProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, HttpClientTestingModule],
      declarations: [ ProgramComponent ],
    })
  }));

})
