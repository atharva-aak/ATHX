import { File } from '../types';

export const generateInitialFileSystem = (userId: string): Omit<File, 'id' | 'created' | 'modified'>[] => [
  {
    name: 'Documents',
    type: 'folder',
    parentId: null,
    size: 0,
    owner: userId
  },
  {
    name: 'Pictures',
    type: 'folder',
    parentId: null,
    size: 0,
    owner: userId
  },
  {
    name: 'Welcome.txt',
    type: 'file',
    content: `Welcome to WebOS, ${userId}!\n\nThis is your personal workspace. Here's how to get started:\n\n1. Click on app icons in the dock to launch applications\n2. Use the File Explorer to manage your files\n3. Try the Calculator for quick calculations\n4. Customize your experience in Settings\n\nEnjoy your WebOS experience!`,
    parentId: null,
    size: 250,
    owner: userId
  }
];

export const getFileById = (files: File[], id: string): File | undefined => {
  return files.find(file => file.id === id);
};

export const getFilesByParentId = (files: File[], parentId: string | null): File[] => {
  return files.filter(file => file.parentId === parentId);
};

export const getFilePath = (files: File[], fileId: string): string => {
  const file = getFileById(files, fileId);
  if (!file) return '';
  
  if (file.parentId === null) {
    return `/${file.name}`;
  }
  
  const parentPath = getFilePath(files, file.parentId);
  return `${parentPath}/${file.name}`;
};

export const calculateFolderSize = (files: File[], folderId: string): number => {
  const childFiles = files.filter(file => file.parentId === folderId);
  
  return childFiles.reduce((total, file) => {
    if (file.type === 'folder') {
      return total + calculateFolderSize(files, file.id);
    }
    return total + file.size;
  }, 0);
};