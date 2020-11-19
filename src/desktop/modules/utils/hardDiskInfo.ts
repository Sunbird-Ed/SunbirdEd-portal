import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as os from "os";
import ContentLocation from "../controllers/contentLocation";
import { manifest } from "../manifest";
const systemSDK = containerAPI.getSystemSDKInstance(manifest.id);

export default class HardDiskInfo {
    public static async getAvailableDiskSpace() {
        const { availableHarddisk, fsSize } = await systemSDK.getHardDiskInfo();

        if (os.platform() === "win32") {
            const fileSize: any = fsSize;
            const contentLocation = new ContentLocation(manifest.id);
            const contentDirPath = await contentLocation.get();
            const currentContentPath = contentDirPath || "C:";
            const selectedDrive = fileSize.find((driveInfo) => currentContentPath.startsWith(driveInfo.fs));
            const availableDriveSpace = selectedDrive.size - selectedDrive.used;

            return availableDriveSpace - 5e+8; // keeping buffer of 500 mb, this can be configured
        } else {
            return availableHarddisk - 5e+8; // keeping buffer of 500 mb, this can be configured
        }
    }
}
