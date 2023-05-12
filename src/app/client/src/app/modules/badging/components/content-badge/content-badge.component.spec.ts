import { of } from "rxjs";
import { ContentBadgeService } from "../../services";
import { ContentBadgeComponent } from "./content-badge.component";

describe("ContentBadgeComponent", () => {
    let component: ContentBadgeComponent;
    let mockBadgeData: [
        {
            'assertionId': 'd56e6d23-70cb-49dc-9c04-0050ae9067da',
            'badgeClassImage': 'https://sunbirddev.blob.core.windows.net/badgr/uploads/badges/b0fcde73f1fd81491235e3cfddd15b1c.png',
            'badgeClassName': 'Official Textbook - MH',
            'badgeId': 'badgeslug-2',
            'createdTS': '1526552568280',
            'issuerId': 'issuerslug-2',
            'status': 'active'
        }
    ]

    const mockContentBadgeService: Partial<ContentBadgeService> = {
    };
    
    beforeAll(() => {
        component = new ContentBadgeComponent(
            mockContentBadgeService as ContentBadgeService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be create a instance of Content Badge Component', () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnInit", () => {
        it('should get badge', () => {
            mockContentBadgeService.badges = of(mockBadgeData) as any;
            component.ngOnInit();
            expect(component.data).toBeDefined();
        });
    });

    describe("ngOnDestroy", () => {
        it('should destroy sub', () => {
            component.unsubscribe = {
                next: jest.fn(),
                complete: jest.fn()
            } as any;
            component.ngOnDestroy();
            expect(component.unsubscribe.next).toHaveBeenCalled();
            expect(component.unsubscribe.complete).toHaveBeenCalled();
        });
    });


})