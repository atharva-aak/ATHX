import { AppMetadata } from '../types';
import { FileTextIcon, Calculator, FolderOpen, Settings, UserIcon as BrowserIcon, Terminal, ImageIcon } from 'lucide-react';

export const appRegistry: AppMetadata[] = [
  {
    id: 'fileExplorer',
    name: 'Files',
    icon: 'FolderOpen',
    component: 'FileExplorer',
    defaultSize: { width: 700, height: 500 }
  },
  {
    id: 'textEditor',
    name: 'Text Editor',
    icon: 'FileTextIcon',
    component: 'TextEditor',
    defaultSize: { width: 600, height: 400 }
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: 'Calculator',
    component: 'Calculator',
    defaultSize: { width: 300, height: 400 }
  },
  {
    id: 'browser',
    name: 'Browser',
    icon: 'BrowserIcon',
    component: 'Browser',
    defaultSize: { width: 800, height: 600 }
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    component: 'Settings',
    defaultSize: { width: 500, height: 400 }
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: 'Terminal',
    component: 'Terminal',
    defaultSize: { width: 600, height: 400 }
  },
  {
    id: 'imageViewer',
    name: 'Image Viewer',
    icon: 'ImageIcon',
    component: 'ImageViewer',
    defaultSize: { width: 700, height: 500 }
  }
];