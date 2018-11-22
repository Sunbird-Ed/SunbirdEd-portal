import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TopicPickerComponent } from './topic-picker.component';
import { FormsModule } from '@angular/forms';

describe('TopicPickerComponent', () => {
    let component: TopicPickerComponent;
    let fixture: ComponentFixture<TopicPickerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [ TopicPickerComponent ],
            providers: []
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TopicPickerComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
