import { ResourceService } from '@sunbird/shared';
import { FrameworkCatLabelTranslatePipe } from './framework-label-translate.pipe';

describe('FrameworkCatLabelTranslatePipe', () => {
  let pipe: FrameworkCatLabelTranslatePipe;

  const mockResourceService: Partial<ResourceService> = {
    frmelmnts: {
      lbl:{
        board: "board",
        medium: "medium",
        gradeLevel: "class",
        class: "class",
        publishedBy: "publishedBy",
        subject: "subject",
        publishedUserType: "publishedUserType"
      }
    }
  } as any

  beforeEach(() => {
    pipe = new FrameworkCatLabelTranslatePipe(
      mockResourceService as ResourceService
    );
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });


  describe('#transform', () => {
    it('Should tranform category label', () => {
        const transformedResult = pipe.transform('board');
        expect(transformedResult).toBeDefined();
        expect(transformedResult).toBe('board');
    });

    it('Should return the label if translation is not available', () => {
        const transformedResult = pipe.transform('random');
        expect(transformedResult).toBeDefined();
        expect(transformedResult).toBe('random');
    });

    it('Should return translation if translation key is passed', () => {
        const transformedResult = pipe.transform('frmelmnts.lbl.board');
        expect(transformedResult).toBeDefined();
        expect(transformedResult).toBe('board');
    });
  });
});