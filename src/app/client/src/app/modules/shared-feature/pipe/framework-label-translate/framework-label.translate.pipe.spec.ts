import { ResourceService, SharedModule } from '@sunbird/shared';
import { FrameworkCatLabelTranslatePipe } from './framework-label-translate.pipe';
import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from '@sunbird/test-util';

describe('FrameworkCatLabelTranslatePipe', () => {
    configureTestSuite()
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FrameworkCatLabelTranslatePipe],
            imports: [SharedModule.forRoot(), HttpClientTestingModule],
            providers: [
                {
                    provide: ResourceService, useValue: {
                        frmelmnts: {
                            lbl: {
                                boards: 'boards'
                            }
                        }
                    }
                }
            ]
        })
            .compileComponents();
    }));

    describe('#transform', () => {
        it('Should tranform category label', () => {
            const resourceService = TestBed.get(ResourceService);
            const pipe = new FrameworkCatLabelTranslatePipe(resourceService);
            const transformedResult = pipe.transform('board');
            expect(transformedResult).toBeDefined();
            expect(transformedResult).toBe('boards');
        });

        it('Should return the label if translation is not available', () => {
            const resourceService = TestBed.get(ResourceService);
            const pipe = new FrameworkCatLabelTranslatePipe(resourceService);
            const transformedResult = pipe.transform('random');
            expect(transformedResult).toBeDefined();
            expect(transformedResult).toBe('random');
        });
    });
});