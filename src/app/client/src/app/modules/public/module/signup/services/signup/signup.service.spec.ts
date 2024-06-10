import { SignupService } from "./signup.service";
import { LearnerService } from "@sunbird/core";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { ConfigService } from "../../../../../../modules/shared";
import * as mock from "./signup.service.spec.data";
describe("SignupService", () => {
    let component: SignupService;

    const mockLearnerService: Partial<LearnerService> = {
        post: jest.fn(),
        get: jest.fn(),
    };
    const mockConfigService: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                OTP: {
                    GENERATE: "otp/v2/generate",
                    VERIFY: "otp/v2/verify",
                    ANONYMOUS: {
                        GENERATE: "anonymous/otp/v2/generate",
                    },
                },
                USER: {
                    GET_USER_BY_KEY: "user/v2/get",
                    CHECK_USER_EXISTS: "user/v2/exists",
                    CREATE_V2: "user/v2/create",
                    SIGN_UP_V1: "user/v2/signup",
                    TNC_ACCEPT_LOGIN: "user/v2/accept/tnc",
                },
            },
        },
    };
    const mockHttpClient: Partial<HttpClient> = {
        post: jest.fn(),
    };

    beforeAll(() => {
        component = new SignupService(
            mockLearnerService as LearnerService,
            mockConfigService as ConfigService,
            mockHttpClient as HttpClient
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
    it("should call generate API ", () => {
        const params = { request: { key: "1242142", type: "phone" } };
        jest.spyOn(mockLearnerService, "post").mockReturnValue(of(mock.mockRes.generateOtpData));
        const options = { url: "otp/v2/generate", data: params };
        component.generateOTP(params);
        expect(mockLearnerService.post).toHaveBeenCalledWith(options);
    });

    it("should call generate API for anonymous", () => {
        const params = { request: { key: "1242142", type: "phone" } };
        jest
            .spyOn(mockLearnerService, "post")
            .mockReturnValue(of(mock.mockRes.generateAnonymousOtpData));
        const options = {
            url: "anonymous/otp/v2/generate" + "?captchaResponse=" + "G-cjkdjflsfkja",
            data: params,
        };
        component.generateOTPforAnonymousUser(params, "G-cjkdjflsfkja");
        expect(mockLearnerService.post).toHaveBeenCalledWith(options);
    });

    it("should call verify otp API", () => {
        const params = { request: { key: "1242142", type: "phone" } };
        jest
            .spyOn(mockLearnerService, "post")
            .mockReturnValue(of(mock.mockRes.verifyOtpData));
        const options = {
            url: "otp/v2/verify",
            data: params,
        };
        component.verifyOTP(params);
        expect(mockLearnerService.post).toHaveBeenCalledWith(options);
    });

    it("should call get User By Key API", () => {
        const params = { request: { key: "1242142", type: "phone" } };
        jest.spyOn(mockLearnerService, "get").mockReturnValue(of(mock.mockRes.getUserData));
        const options = { url: "user/v2/get" };
        component.getUserByKey(params);
        expect(mockLearnerService.get).toHaveBeenCalled();
    });

    it("should call check user exists API", () => {
        const params = { request: { key: "1242142", type: "phone" } };
        jest.spyOn(mockLearnerService, "get").mockReturnValue(of(mock.mockRes.verifyUserData));
        const options = { url: "user/v2/exists" };
        component.checkUserExists(params);
        expect(mockLearnerService.get).toHaveBeenCalled();
    });

    it("should call create user API", () => {
        const params = { request: { key: "1242142", type: "phone" } };
        jest.spyOn(mockLearnerService, "post").mockReturnValue(of(mock.mockRes.createUserData));
        const options = { url: "user/v2/create", data: params };
        component.createUser(params);
        expect(mockLearnerService.post).toHaveBeenCalledWith(options);
    });

    it("should call accepttermsandconditions API", () => {
        const params = { request: { key: "1242142", type: "phone" } };
        jest.spyOn(mockLearnerService, "post").mockReturnValue(of(mock.mockRes.tncData));
        const options = { url: "user/v2/accept/tnc", data: params };
        component.acceptTermsAndConditions(params);
        expect(mockHttpClient.post).toHaveBeenCalled();
    });

    it("should call create user V3 API", () => {
        const params = { request: { key: "1242142", type: "phone" } };
        jest.spyOn(mockLearnerService, "post").mockReturnValue(of(mock.mockRes.signupUserData));
        const options = { url: "user/v2/signup", data: params };
        component.createUserV3(params);
        expect(mockLearnerService.post).toHaveBeenCalledWith(options);
    });
});
