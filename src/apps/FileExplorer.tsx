import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { getFilesByParentId, getFilePath } from '../data/fileSystem';
import { File as FileType } from '../types';
import { FolderIcon, FileIcon, FileTextIcon, ImageIcon, ArrowLeftIcon, ArrowRightIcon, FolderPlusIcon, FileEditIcon } from 'lucide-react';

interface FileExplorerProps {
  currentFolderId?: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ currentFolderId = null }) => {
  const { state, dispatch } = useSystem();
  const [history, setHistory] = useState<(string | null)[]>([null]); // null represents root
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  
  // Get current folder from history
  const activeFolderId = history[historyIndex];
  
  // Calculate breadcrumbs
  const getBreadcrumbs = () => {
    if (activeFolderId === null) {
      return [{ id: null, name: 'Home' }];
    }
    
    const breadcrumbs = [{ id: null, name: 'Home' }];
    let currentId = activeFolderId;
    
    while (currentId) {
      const folder = state.files.find(f => f.id === currentId);
      if (folder) {
        breadcrumbs.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    
    return breadcrumbs;
  };
  
  // Get files for current folder
  const files = getFilesByParentId(state.files, activeFolderId);
  
  // Navigate to folder
  const navigateToFolder = (folderId: string | null) => {
    // Remove forward history if we're navigating from middle
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(folderId);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSelectedFileId(null);
  };
  
  // Go back in history
  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSelectedFileId(null);
    }
  };
  
  // Go forward in history
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSelectedFileId(null);
    }
  };
  
  // Handle file double click
  const handleFileDoubleClick = (file: FileType) => {
    if (file.type === 'folder') {
      navigateToFolder(file.id);
    } else {
      // Open appropriate app based on file type
      if (file.name.endsWith('.txt')) {
        dispatch({
          type: 'OPEN_WINDOW',
          payload: {
            appId: 'textEditor',
            params: { fileId: file.id }
          }
        });
      } else if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        dispatch({
          type: 'OPEN_WINDOW',
          payload: {
            appId: 'imageViewer',
            params: { fileId: file.id }
          }
        });
      }
    }
  };
  
  // Create new folder
  const createNewFolder = () => {
    const baseName = 'New Folder';
    let name = baseName;
    let counter = 1;
    
    // Make sure we don't create duplicate names
    while (files.some(file => file.name === name)) {
      name = `${baseName} ${counter}`;
      counter++;
    }
    
    dispatch({
      type: 'CREATE_FILE',
      payload: {
        file: {
          name,
          type: 'folder',
          parentId: activeFolderId,
          size: 0
        }
      }
    });
  };
  
  // Create new text file
  const createNewTextFile = () => {
    const baseName = 'New Text Document.txt';
    let name = baseName;
    let counter = 1;
    
    // Make sure we don't create duplicate names
    while (files.some(file => file.name === name)) {
      name = `New Text Document (${counter}).txt`;
      counter++;
    }
    
    dispatch({
      type: 'CREATE_FILE',
      payload: {
        file: {
          name,
          type: 'file',
          content: '',
          parentId: activeFolderId,
          size: 0
        }
      }
    });
  };
  
  // Get appropriate icon for file
  const getFileIcon = (file: FileType) => {
    if (file.type === 'folder') {
      return <FolderIcon className="text-yellow-500" size={18} />;
    }
    
    // Text files
    if (file.name.endsWith('.txt')) {
      return <FileTextIcon className="text-blue-500" size={18} />;
    }
    
    // Image files
    if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return <ImageIcon className="text-green-500" size={18} />;
    }
    
    // Default file icon
    return <FileIcon className="text-gray-500" size={18} />;
  };
  
  // Format file size
  const formatFileSize = (size: number): string => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="p-2 border-b flex items-center space-x-2 dark:border-gray-700">
        <button
          onClick={goBack}
          disabled={historyIndex === 0}
          className="p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-gray-700 dark:active:bg-gray-600"
        >
          <ArrowLeftIcon size={16} className="dark:text-white" />
        </button>
        
        <button
          onClick={goForward}
          disabled={historyIndex === history.length - 1}
          className="p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-gray-700 dark:active:bg-gray-600"
        >
          <ArrowRightIcon size={16} className="dark:text-white" />
        </button>
        
        {/* Breadcrumb navigation */}
        <div className="flex-1 flex items-center space-x-1 text-sm dark:text-white">
          {getBreadcrumbs().map((crumb, index, arr) => (
            <React.Fragment key={crumb.id || 'root'}>
              <button
                className="hover:underline px-1 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => navigateToFolder(crumb.id)}
              >
                {crumb.name}
              </button>
              {index < arr.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </div>
        
        {/* Actions */}
        <button
          onClick={createNewFolder}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
          title="New Folder"
        >
          <FolderPlusIcon size={16} />
        </button>
        
        <button
          onClick={createNewTextFile}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
          title="New Text Document"
        >
          <FileEditIcon size={16} />
        </button>
      </div>
      
      {/* File list */}
      <div className="flex-1 overflow-auto p-2">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">Modified</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  This folder is empty
                </td>
              </tr>
            )}
            
            {files.map((file) => (
              <tr
                key={file.id}
                className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedFileId === file.id ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                }`}
                onClick={() => setSelectedFileId(file.id)}
                onDoubleClick={() => handleFileDoubleClick(file)}
              >
                <td className="px-4 py-2 flex items-center space-x-2 dark:text-white">
                  {getFileIcon(file)}
                  <span>{file.name}</span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                  {file.type === 'folder' ? '--' : formatFileSize(file.size)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(file.modified).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileExplorer;