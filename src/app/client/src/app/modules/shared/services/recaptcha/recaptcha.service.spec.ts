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
                        VALIDATE: 'https://example.com/recaptcha/validate'
                    }
                }
            }
        };

        recaptchaService = new RecaptchaService(httpClientMock, configServiceMock);
    });

    it('should be created', () => {
      expect(recaptchaService).toBeTruthy();
    });

    describe('validateRecaptcha', () => {
        it('should send a POST request with the correct URL and parameters', () => {
           const recaptchaToken = 'mockRecaptchaToken';
           const expectedUrl = configServiceMock.urlConFig.URLS.RECAPTCHA.VALIDATE + '?captchaResponse=' + recaptchaToken;
           const expectedHeaders = {"headers": {"Content-Type": "application/json"}}
           const expectedResult = { success: true };

           httpClientMock.post.mockReturnValue(of(expectedResult));

           const result = recaptchaService.validateRecaptcha(recaptchaToken);
           expect(httpClientMock.post).toHaveBeenCalledWith(expectedUrl,expectedHeaders);
           expect(result).toEqual(of(expectedResult));
        });
    });
});