import { RecaptchaService } from './recaptcha.service';
import { of } from 'rxjs';

describe('RecaptchaService', () => {
    let recaptchaService: RecaptchaService;
    let httpClientMock: jest.Mocked<any>;
    let configServiceMock: jest.Mocked<any>;

    beforeEach(() => {
        httpClientMock = {
            post: jest.fn()
        };

        configServiceMock = {
            urlConFig: {
                URLS: {
                    RECAPTCHA: {
                        VALIDATE: 'mockedRecaptchaUrl'
                    }
                }
            }
        };

        recaptchaService = new RecaptchaService(httpClientMock as any, configServiceMock as any);
    });

    it('should be created', () => {
      expect(recaptchaService).toBeTruthy();
    });

    describe('validateRecaptcha', () => {
        it('should validate recaptcha token', () => {
            const recaptchaToken = 'mockedRecaptchaToken';
            httpClientMock.post.mockReturnValue(of({}));
        
            recaptchaService.validateRecaptcha(recaptchaToken);
        
            expect(httpClientMock.post).toHaveBeenCalledWith(
              'mockedRecaptchaUrl?captchaResponse=mockedRecaptchaToken',
              { headers: { 'Content-Type': 'application/json' } }
            );
        });

        it('should handle validation error', () => {
            const recaptchaToken = 'mockedRecaptchaToken';
            const errorResponse = { error: 'mockedError' };
            httpClientMock.post.mockReturnValue(of(errorResponse));
        
            recaptchaService.validateRecaptcha(recaptchaToken).subscribe(
              () => {
                fail('Expected an error, but received a success response');
              },
              (error) => {
                expect(error).toEqual(errorResponse);
              }
            );
        
            expect(httpClientMock.post).toHaveBeenCalledWith(
              'mockedRecaptchaUrl?captchaResponse=mockedRecaptchaToken',
              { headers: { 'Content-Type': 'application/json' } }
            );
        });
    });
});