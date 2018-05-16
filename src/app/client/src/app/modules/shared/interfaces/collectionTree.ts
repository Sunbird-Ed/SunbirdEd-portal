export interface ICollectionTreeOptions {
  folderIcon?: string;
  fileIcon: string;
  customFileIcon: { [index: string]: string };
}

export interface ICollectionTree {
    id?: string;
    title: string;
    children?: ICollectionTree[];
}

export interface ICollectionTreeNodes {
  data: ICollectionTree;
}

export enum FileTypes {
  'doc',
  'image',
  'video',
  'audio',
  'ECML',
  'HTML',
  'H5P',
  'youtube',
  'pdf',
  'epub',
  'collection'
}

export enum MimeTypeTofileType {
    'application/vnd.ekstep.ecml-archive' = 'ECML',
    'application/vnd.ekstep.html-archive' = 'HTML',
    'application/vnd.android.package-archive' = 'APK',
    'application/vnd.ekstep.content-archive' = 'ECML',
    'application/vnd.ekstep.content-collection' = 'collection',
    'application/vnd.ekstep.plugin-archive' = 'plugin',
    'application/vnd.ekstep.h5p-archive' = 'H5P',
    'application/epub' = 'epub',
    'text/x-url' = 'url',
    'video/x-youtube' = 'youtube',
    'application/octet-stream' = 'doc',
    'application/msword' = 'doc',
    'application/pdf' = 'pdf',
    'image/jpeg' = 'image',
    'image/jpg' = 'image',
    'image/png' = 'image',
    'image/tiff' = 'image',
    'image/bmp' = 'image',
    'image/gif' = 'image',
    'image/svg+xml' = 'image',
    'video/avi' = 'video',
    'video/mpeg' = 'video',
    'video/quicktime' = 'video',
    'video/3gpp' = 'video',
    'video/mp4' = 'video',
    'video/ogg' = 'video',
    'video/webm' = 'video',
    'audio/mp3' = 'audio',
    'audio/mp4' = 'audio',
    'audio/mpeg' = 'audio',
    'audio/ogg' = 'audio',
    'audio/webm' = 'audio',
    'audio/x-wav' = 'audio',
    'audio/wav' = 'audio'
}
