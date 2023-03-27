import { ConfigService } from './config.service';

xdescribe('ConfigService', () => {
    let configService: ConfigService;

    beforeEach(() => {
        configService = new ConfigService();
        jest.clearAllMocks();
    });

    it('should be created', () => {
        expect(configService).toBeTruthy();
    });
});

