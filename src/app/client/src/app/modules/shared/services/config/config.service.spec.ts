import { ConfigService } from './config.service';

describe('ConfigService', () => {
    let configService: ConfigService;

    beforeEach(() => {
        configService = new ConfigService();
    });

    it('should be created', () => {
        expect(configService).toBeTruthy();
    });
});

