export interface IAnnouncementListData {
  count: number;
  announcements?: Array<IAnnouncementDetails>;
  metricsupdateddate?: string;
}

export interface IAnnouncementDetails {
  attachments?: Array<IAttachementType>;
  createdDate: string;
  description: string;
  from: string;
  id: string;
  links?: Array<string>;
  metrics?: { sent: number, received: number, read: number };
  status: string;
  target?: any;
  title: string;
  type: string;
  read?: boolean;
  received?: boolean;
}

export interface IAttachementType {
  name: string;
  mimetype?: string;
  size?: string;
  link?: string;
}

export interface IPagination {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  startIndex: number;
  endIndex: number;
  pages: Array<number>;
}
