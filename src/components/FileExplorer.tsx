import React, { useState, useEffect, useRef } from 'react';
import { useSystem } from '../context/SystemContext';
import { getFilesByParentId, getFilePath } from '../data/fileSystem';
import { File as FileType } from '../types';
import { FolderIcon, FileIcon, FileTextIcon, ImageIcon, ArrowLeftIcon, ArrowRightIcon, FolderPlusIcon, FileEditIcon } from 'lucide-react';

interface RenameDialogProps {
  isOpen: boolean;
  initialName: string;
  onClose: () => void;
  onRename: (newName: string) => void;
}

const RenameDialog: React.FC<RenameDialogProps> = ({ isOpen, initialName, onClose, onRename }) => {
  const [newName, setNewName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      setNewName(initialName);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen, initialName]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newName !== initialName) {
      onRename(newName.trim());
    }
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg p-6 min-w-[300px]">
        <h2 className="text-lg font-medium mb-4 dark:text-white">Rename Item</h2>
        <input
          ref={inputRef}
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Rename
          </button>
        </div>
      </form>
    </div>
  );
};

interface FileExplorerProps {
  currentFolderId?: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ currentFolderId = null }) => {
  const { state, dispatch } = useSystem();
  const [history, setHistory] = useState<(string | null)[]>([null]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [renameDialog, setRenameDialog] = useState<{ isOpen: boolean; fileId: string | null }>({
    isOpen: false,
    fileId: null
  });
  
  const activeFolderId = history[historyIndex];
  const files = getFilesByParentId(state.files, activeFolderId);
  
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
  
  const navigateToFolder = (folderId: string | null) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(folderId);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSelectedFileId(null);
  };
  
  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSelectedFileId(null);
    }
  };
  
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSelectedFileId(null);
    }
  };
  
  const handleFileDoubleClick = (file: FileType) => {
    if (file.type === 'folder') {
      navigateToFolder(file.id);
    } else {
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
  
  const createNewItem = (type: 'file' | 'folder') => {
    const defaultName = type === 'file' ? 'New File.txt' : 'New Folder';
    const newName = prompt(`Enter name for new ${type}:`, defaultName);
    
    if (newName && newName.trim()) {
      dispatch({
        type: 'CREATE_FILE',
        payload: {
          file: {
            name: newName.trim(),
            type,
            content: type === 'file' ? '' : undefined,
            parentId: activeFolderId,
            size: 0,
            owner: state.user?.id || null
          }
        }
      });
    }
  };
  
  const handleRename = (fileId: string) => {
    const file = state.files.find(f => f.id === fileId);
    if (file) {
      setRenameDialog({ isOpen: true, fileId });
    }
  };
  
  const handleRenameSubmit = (newName: string) => {
    if (renameDialog.fileId) {
      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          fileId: renameDialog.fileId,
          updates: { name: newName }
        }
      });
    }
  };
  
  const getFileIcon = (file: FileType) => {
    if (file.type === 'folder') {
      return <FolderIcon className="text-yellow-500" size={18} />;
    }
    
    if (file.name.endsWith('.txt')) {
      return <FileTextIcon className="text-blue-500" size={18} />;
    }
    
    if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return <ImageIcon className="text-green-500" size={18} />;
    }
    
    return <FileIcon className="text-gray-500" size={18} />;
  };
  
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
        
        <button
          onClick={() => createNewItem('folder')}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
          title="New Folder"
        >
          <FolderPlusIcon size={16} />
        </button>
        
        <button
          onClick={() => createNewItem('file')}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
          title="New Text Document"
        >
          <FileEditIcon size={16} />
        </button>
      </div>
      
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
                  <span className="truncate max-w-xs">{file.name}</span>
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
      
      <RenameDialog
        isOpen={renameDialog.isOpen}
        initialName={state.files.find(f => f.id === renameDialog.fileId)?.name || ''}
        onClose={() => setRenameDialog({ isOpen: false, fileId: null })}
        onRename={handleRenameSubmit}
      />
    </div>
  );
};

export default FileExplorer;