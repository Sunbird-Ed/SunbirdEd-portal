import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TopicPickerComponent } from './topic-picker.component';
import { FormsModule } from '@angular/forms';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { of as observableOf } from 'rxjs';
import { configureTestSuite } from '@sunbird/test-util';

describe('TopicPickerComponent', () => {
    let component: TopicPickerComponent;
    let fixture: ComponentFixture<TopicPickerComponent>;
    const topics = [{
        identifier: '01',
        name: 'topic_1',
        children: []
    }, {
        identifier: '02',
        name: 'topic_2',
        children: []
    }];
    const resourceBundle = {
        'messages': {
            'stmsg': {
                'm0007': 'Search for something else',
                'm0006': 'No result'
            },
            'fmsg': {
                'm0089': 'No Topics/SubTopics found'
            }
        },
        languageSelected$: observableOf({}),
        getLanguageChange: () => { },
        getResource: () => ({}),
        frmelmnts: {
            lbl: {
                topics: topics,
                done: 'Done',
                removeAll: 'Remove All',
                chooseAll: 'Choose All',
                selected: 'Selected'
            },
            btn: {
                cancelCapitalize: 'CANCEL'
            },
            prmpt: {
                search: 'Search'
            }
        }
    };
    configureTestSuite();
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, HttpClientTestingModule],
            declarations: [TopicPickerComponent],
            providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService,
                { provide: ResourceService, useValue: resourceBundle }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TopicPickerComponent);
        component = fixture.componentInstance;
        spyOn(component['lazzyLoadScriptService'], 'loadScript').and.returnValue(observableOf({}));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call formatSelectedTopics', () => {
        const unformattedTopis = ['topic', 'topic_2'];
        // @ts-ignore
        const spyFormatSelectedTopics = spyOn(component, 'formatSelectedTopics').and.callThrough();
        spyFormatSelectedTopics.call(component, topics, unformattedTopis, []);
        // @ts-ignore
        expect(component, 'formatSelectedTopics').toBeTruthy();
    });

    it('should call format topics', () => {
        // @ts-ignore
        const spyFormatTopics = spyOn(component, 'formatTopics').and.callThrough();
        spyFormatTopics.call(component, topics, false);
        // @ts-ignore
        expect(component, 'formatTopics').toBeTruthy();
    });
});
