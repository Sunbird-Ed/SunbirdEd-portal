import { QuestionnaireService } from "./questionnaire.service";
import { ConfigService, ToasterService } from "../shared";
import { CloudService, KendraService } from "../core";
import { SlUtilsService } from "@shikshalokam/sl-questionnaire";
import { PayloadData } from './questionnaire.service.mock';

describe("QuestionnaireService", () => {
  let questionnaireService: QuestionnaireService;

  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        KENDRA: {
          PRESIGNED_URLS: "cloud-services/mlcore/v1/files/preSignedUrls",
        },
      },
    },
  }
  const mockKendraService: Partial<KendraService> = {
    post: jest.fn()
  }
  const mockCloudService: Partial<CloudService> = {
    put: jest.fn()
  }
  const mockSlUtilsService: Partial<SlUtilsService> = {}
  const mockToasterService: Partial<ToasterService> = {
    error: jest.fn()
  }

  beforeAll(() => {
    questionnaireService = new QuestionnaireService(
      mockConfigService as ConfigService,
      mockKendraService as KendraService,
      mockCloudService as CloudService,
      mockSlUtilsService as SlUtilsService,
      mockToasterService as ToasterService,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should be created", () => {
    expect(QuestionnaireService).toBeTruthy();
  });

  it('Should fetch pre signed url', () => {
    jest.spyOn(questionnaireService, 'getPreSingedUrls');
    questionnaireService.getPreSingedUrls(PayloadData);
    expect(questionnaireService.getPreSingedUrls).toHaveBeenCalled();
  });

  it('Should upload to cloud', () => {
    jest.spyOn(questionnaireService, 'cloudStorageUpload');
    questionnaireService.cloudStorageUpload(PayloadData);
    expect(questionnaireService.cloudStorageUpload).toHaveBeenCalled();
  });
});
