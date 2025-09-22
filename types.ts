
export interface Contact {
  id: number;
  [key: string]: any; 
  'Contact_Email_0'?: string;
  'Company_Name_0'?: string;
  'Send_Status'?: string; 
}

export enum LogType {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

export interface LogEntry {
  id: number;
  message: string;
  type: LogType;
}

export interface TemplateData {
    subject: string;
    body: string;
}
