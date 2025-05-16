import React from 'react';
import { File } from '../types';
import { FolderIcon, FileIcon, FileTextIcon, ImageIcon } from 'lucide-react';

interface DesktopIconProps {
  file: File;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ file, onDoubleClick, onContextMenu }) => {
  // Determine icon based on file type and extension
  const getFileIcon = () => {
    if (file.type === 'folder') {
      return <FolderIcon className="mx-auto text-yellow-500" size={36} />;
    }
    
    // Text files
    if (file.name.endsWith('.txt')) {
      return <FileTextIcon className="mx-auto text-blue-500" size={36} />;
    }
    
    // Image files
    if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return <ImageIcon className="mx-auto text-green-500" size={36} />;
    }
    
    // Default file icon
    return <FileIcon className="mx-auto text-gray-500" size={36} />;
  };
  
  return (
    <div 
      className="p-2 flex flex-col items-center cursor-pointer rounded-lg hover:bg-white/20 active:bg-white/30 dark:hover:bg-gray-800/20 dark:active:bg-gray-800/30"
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      {getFileIcon()}
      <span className="mt-1 text-xs font-medium text-center text-gray-800 dark:text-white truncate w-full px-1">
        {file.name}
      </span>
    </div>
  );
};

export default DesktopIcon;