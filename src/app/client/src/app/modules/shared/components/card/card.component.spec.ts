import { ResourceService } from '../../services/index';
import { Router } from '@angular/router';
import { CardComponent } from './card.component';

describe("Card Component", () => {
  let component: CardComponent;
  
  const mockResourceService: Partial<ResourceService> = {
    frmelmnts: {
      lbl: {
        Select: 'Select'
      },
      cert: {
        lbl: {
          preview: 'preview',
          certAddSuccess: 'Certificate added successfully',
          certUpdateSuccess: 'Certificate updated successfully.',
          certAddError: 'Failed to add the certificate. Try again later.',
          certEditError: 'Failed to edit the certificate. Try again later.'
        }
      }
    },
    messages: {
      emsg: {
        m0005: 'Something went wrong, try again later'
      }
    }
  };
  const mockRouter: Partial<Router> = {
    navigate: jest.fn()
  };
  beforeAll(() => {
    component = new CardComponent(
      mockResourceService as ResourceService,
      mockRouter as Router
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should be create a instance of CardComponent', () => {
    expect(component).toBeTruthy();
  });
});