export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Window = {
  id: string;
  title: string;
  component: string;
  position: Position;
  size: Size;
  isActive: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  icon: string;
  params?: Record<string, any>;
};

export type AppMetadata = {
  id: string;
  name: string;
  icon: string;
  component: string;
  defaultSize: Size;
};

export type FileType = 'file' | 'folder';

export type File = {
  id: string;
  name: string;
  type: FileType;
  content?: string;
  parentId: string | null;
  created: Date;
  modified: Date;
  size: number;
  owner: string | null;
};

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
};

export type User = {
  id: string;
  username: string;
  created: Date;
};