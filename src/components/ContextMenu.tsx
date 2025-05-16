import React, { useEffect, useRef } from 'react';
import { useSystem } from '../context/SystemContext';

interface ContextMenuProps {
  x: number;
  y: number;
  type: 'desktop' | 'file';
  fileId?: string;
  onCreateNewFile: () => void;
  onCreateNewFolder: () => void;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  type,
  fileId,
  onCreateNewFile,
  onCreateNewFolder,
  onClose
}) => {
  const { state, dispatch } = useSystem();
  const menuRef = useRef<HTMLDivElement>(null);
  
  const file = fileId ? state.files.find(f => f.id === fileId) : undefined;
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);
  
  // Rename file
  const handleRename = () => {
    if (!fileId) return;
    
    const newName = prompt('Enter new name:', file?.name);
    if (newName && newName.trim() !== '') {
      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          fileId,
          updates: { name: newName.trim() }
        }
      });
    }
    
    onClose();
  };
  
  // Delete file
  const handleDelete = () => {
    if (!fileId || !file) return;
    
    if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
      // For now, we just update the file to make it "deleted"
      // In a real implementation, we would fully remove it
      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          fileId,
          updates: { name: `${file.name} (deleted)` }
        }
      });
    }
    
    onClose();
  };
  
  // Open file or folder
  const handleOpen = () => {
    if (!fileId || !file) return;
    
    if (file.type === 'folder') {
      dispatch({
        type: 'OPEN_WINDOW',
        payload: {
          appId: 'fileExplorer',
          params: { currentFolderId: fileId }
        }
      });
    } else if (file.name.endsWith('.txt')) {
      dispatch({
        type: 'OPEN_WINDOW',
        payload: {
          appId: 'textEditor',
          params: { fileId }
        }
      });
    } else if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      dispatch({
        type: 'OPEN_WINDOW',
        payload: {
          appId: 'imageViewer',
          params: { fileId }
        }
      });
    }
    
    onClose();
  };
  
  // Menu styles
  const menuStyle = {
    top: `${y}px`,
    left: `${x}px`
  };
  
  return (
    <div 
      ref={menuRef}
      className="fixed z-50 bg-white shadow-lg rounded-lg overflow-hidden dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      style={menuStyle}
    >
      <div className="py-1">
        {type === 'desktop' && (
          <>
            <button 
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
              onClick={onCreateNewFile}
            >
              New File
            </button>
            <button 
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
              onClick={onCreateNewFolder}
            >
              New Folder
            </button>
          </>
        )}
        
        {type === 'file' && (
          <>
            <button 
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
              onClick={handleOpen}
            >
              Open
            </button>
            <button 
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
              onClick={handleRename}
            >
              Rename
            </button>
            <button 
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-red-400"
              onClick={handleDelete}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContextMenu;