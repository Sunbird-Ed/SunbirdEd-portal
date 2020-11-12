var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("OpenRAP/dist/api");
const os = require("os");
const contentLocation_1 = require("../controllers/contentLocation");
const manifest_1 = require("../manifest");
const systemSDK = api_1.containerAPI.getSystemSDKInstance(manifest_1.manifest.id);
class HardDiskInfo {
    static getAvailableDiskSpace() {
        return __awaiter(this, void 0, void 0, function* () {
            const { availableHarddisk, fsSize } = yield systemSDK.getHardDiskInfo();
            if (os.platform() === "win32") {
                const fileSize = fsSize;
                const contentLocation = new contentLocation_1.default(manifest_1.manifest.id);
                const contentDirPath = yield contentLocation.get();
                const currentContentPath = contentDirPath || "C:";
                const selectedDrive = fileSize.find((driveInfo) => currentContentPath.startsWith(driveInfo.fs));
                const availableDriveSpace = selectedDrive.size - selectedDrive.used;
                return availableDriveSpace - 5e+8; // keeping buffer of 500 mb, this can be configured
            }
            else {
                return availableHarddisk - 5e+8; // keeping buffer of 500 mb, this can be configured
            }
        });
    }
}
exports.default = HardDiskInfo;
