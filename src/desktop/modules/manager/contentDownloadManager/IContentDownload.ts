export interface IDownloadMetadata {
  contentSize: number;
  downloadedSize: number;
  contentDownloadList: { [Identifier: string]: IContentDownloadList };
  contentId: string;
  mimeType: string;
  contentType: string;
  pkgVersion: number;
}
export interface IContentDownloadList {
  identifier: string;
  url: string;
  size: number;
  failed: boolean;
  downloadId: string;
  step: "DOWNLOAD" | "EXTRACT" | "INDEX" | "COMPLETE" | "DELETE";
}
