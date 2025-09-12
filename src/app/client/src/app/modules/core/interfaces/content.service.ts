export namespace CollectionHierarchyAPI {
  export interface Get {
    id: string;
    ver: string;
    ts: string;
    params: Params;
    responseCode: string;
    result: {
      content: Content;
    };
  }

  export interface Params {
    resmsgid: string;
    msgid?: any;
    err?: any;
    status: string;
    errmsg?: any;
  }

  export interface Collection {
    identifier?: string;
    name?: string;
    objectType?: string;
    relation?: string;
    description?: string;
    index?: number;
    status?: any;
    depth?: any;
    mimeType?: string;
    visibility?: any;
    compatibilityLevel?: number;
  }

  export interface Concept {
    identifier?: string;
    name?: string;
    objectType?: string;
    relation?: string;
    description?: string;
    index?: any;
    status?: any;
    depth?: any;
    mimeType?: any;
    visibility?: any;
    compatibilityLevel?: any;
  }

  export interface Spine {
    ecarUrl?: string;
    size?: number;
  }

  export interface Variants {
    spine?: Spine;
  }

  export interface Child {
    variants?: Variants;
    spine?: Spine;
    pageNumber?: string;
    subject?: string;
    previewUrl?: string;
    downloadUrl?: string;
    source?: string;
    code?: string;
    gradeLevel?: string[];
    usesContent?: any[];
    artifactUrl?: string;
    sYS_INTERNAL_LAST_UPDATED_ON?: string;
    item_sets?: any[];
    lastUpdatedBy?: string;
    notes?: string;
    keywords?: string[];
    channel?: string;
    description?: string;
    language?: string[];
    mimeType?: string;
    portalOwner?: string;
    ageGroup?: string[];
    license?: string;
    size?: number;
    lastPublishedOn?: string;
    lastPublishedBy?: string;
    prevState?: string;
    domain?: string[];
    publisher?: string;
    template?: string;
    methods?: any[];
    imageCredits?: string[];
    lastFlaggedOn?: string;
    flaggedBy?: string[];
    lastPublishDate?: string;
    owner?: string;
    flagReasons?: string[];
    soundCredits?: string[];
    libraries?: any[];
    pkgVersion?: number;
    s3Key?: string;
    createdBy?: string;
    developer?: string;
    idealScreenSize?: string;
    createdOn?: string;
    collections?: Collection[];
    children?: Child[];
    appId?: string;
    contentDisposition?: string;
    contentEncoding?: string;
    lastUpdatedOn?: string;
    contentType?: string;
    identifier?: string;
    audience?: string[];
    visibility?: string;
    os?: string[];
    consumerId?: string;
    index?: number;
    mediaType?: string;
    osId?: string;
    versionKey?: string;
    tags?: string[];
    idealScreenDensity?: string;
    framework?: string;
    concepts?: Concept[];
    compatibilityLevel?: number;
    name?: string;
    status?: string;
  }

  export interface ContentBase {
    code?: string;
    notes?: string;
    keywords?: string[];
    channel?: string;
    description?: string;
    edition?: string;
    language?: string[];
    mimeType?: string;
    idealScreenSize?: string;
    createdOn?: string;
    appIcon?: string;
    collections?: Collection[];
    children?: Child[];
    appId?: string;
    publication?: string;
    contentDisposition?: string;
    contentEncoding?: string;
    lastUpdatedOn?: string;
    contentType?: string;
    owner?: string;
    lastUpdatedBy?: string;
    identifier?: string;
    audience?: string[];
    visibility?: string;
    os?: string[];
    consumerId?: string;
    mediaType?: string;
    osId?: string;
    versionKey?: string;
    tags?: string[];
    idealScreenDensity?: string;
    framework?: string;
    createdBy?: string;
    compatibilityLevel?: number;
    name?: string;
    usedByContent?: any[];
    status?: string;
  }

  export interface Content extends ContentBase {
    [key: string]: any;
  }

}

