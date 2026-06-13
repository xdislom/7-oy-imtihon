export type HwStatus = 'Qaytarilgan' | 'Qabul qilingan' | 'Bajarilmagan' | 'Berilmagan';

export interface Video {
  id: number;
  title: string;
  url: string;
}

export interface TaskDetail {
  title: string;
  deadline: string;
  deadlineStatus?: 'danger' | 'warning';
  fileCount: number;
  description: string;
  date: string;
  attachment?: { name: string };
}

export interface SubmissionDetail {
  title: string;
  fileCount: number;
  links: string[];
  date: string;
  status?: string;
}

export interface FeedbackDetail {
  title: string;
  status: string;
  warning?: string;
  comment: string;
  checker: string;
  date: string;
}

export interface HomeworkDetails {
  score?: number;
  task: TaskDetail;
  submission?: SubmissionDetail;
  feedback?: FeedbackDetail;
  footerMessage?: string;
}

export interface Topic {
  id: number;
  title: string;
  date: string;
  videos: Video[];
  hwStatus?: HwStatus;
  homeworkDetails?: HomeworkDetails;
}

export interface Group {
  id: number;
  name: string;
  direction: string;
  teacher: string;
  startDate: string;
}

export interface Lesson {
  id: number;
  title: string;
  video: string;
  hwStatus: HwStatus;
  hwDeadline: string;
  date: string;
}

export interface NavItem {
  href: string;
  icon: string;
  label: string;
}
