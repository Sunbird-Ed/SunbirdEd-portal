export interface DownloadObject {
    id: string, // Download id
    status: string, // Submitted, InProgress, Complete, Failed.
    createdOn: Date,
    updatedOn: Date,
    stats: {
        totalFiles: number, // Total files to download
        downloadedFiles: number, // Total files downloaded so far
        totalSize: number, // Total number of bytes to download
        downloadedSize: number, // Total number of bytes downloaded so far
    },
    files: [{ // Status of each file within the given download
        id: string, // do_67235 for content otherwise whatever is provided if nothing it will be uuid
        file: string, // File that is downloaded
        source: string, // source from where it is downloaded
        path: string, // Relative path where the file is downloaded to
        size: number, // Total file size in bytes
        downloaded: number // Downloaded until now
    }]
}