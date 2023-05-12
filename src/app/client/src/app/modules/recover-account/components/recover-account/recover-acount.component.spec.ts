import { ResourceService } from "../../../shared";
import { RecoverAccountService } from "../../services";
import { RecoverAccountComponent } from "./recover-account.component";

describe("RecoverAccountComponent", () => {
    let recoverAccountComponent: RecoverAccountComponent;

    const mockRecoverAccountService: Partial<RecoverAccountService> = {};
    const mockResourceService: Partial<ResourceService> = {};

    beforeAll(() => {
        recoverAccountComponent = new RecoverAccountComponent(
            mockRecoverAccountService as RecoverAccountService,
            mockResourceService as ResourceService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should be created", () => {
        expect(recoverAccountComponent).toBeTruthy();
    });
});

