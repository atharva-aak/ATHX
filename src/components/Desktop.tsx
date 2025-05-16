import React, { useState, useEffect } from 'react';
import { useSystem } from '../context/SystemContext';
import { File } from '../types';
import { getFilesByParentId } from '../data/fileSystem';
import Window from './Window';
import Dock from './Dock';
import TaskBar from './TaskBar';
import DesktopIcon from './DesktopIcon';
import ContextMenu from './ContextMenu';

const wallpapers = [
  "https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1920"
];

const Desktop: React.FC = () => {
  const { state, dispatch } = useSystem();
  const { windows, files, isNightMode } = state;
  const [currentWallpaper, setCurrentWallpaper] = useState(0);
  
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    type: 'desktop' | 'file';
    fileId?: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    type: 'desktop'
  });
  
  // Get only desktop files (parentId is null)
  const desktopFiles = getFilesByParentId(files, null);
  
  // Change wallpaper every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWallpaper((prev) => (prev + 1) % wallpapers.length);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, type: 'desktop' | 'file', fileId?: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      type,
      fileId
    });
  };
  
  // Handle desktop click to close context menu
  const handleDesktopClick = () => {
    if (contextMenu.visible) {
      setContextMenu({ ...contextMenu, visible: false });
    }
  };
  
  // Create a new file on desktop
  const createNewFile = (type: 'file' | 'folder') => {
    const baseName = type === 'file' ? 'New File' : 'New Folder';
    let name = baseName;
    let counter = 1;
    
    while (desktopFiles.some(file => file.name === name)) {
      name = `${baseName} ${counter}`;
      counter++;
    }
    
    dispatch({
      type: 'CREATE_FILE',
      payload: {
        file: {
          name,
          type,
          content: type === 'file' ? '' : undefined,
          parentId: null,
          size: 0
        }
      }
    });
    
    setContextMenu({ ...contextMenu, visible: false });
  };
  
  // Open a file
  const openFile = (file: File) => {
    if (file.type === 'folder') {
      dispatch({
        type: 'OPEN_WINDOW',
        payload: {
          appId: 'fileExplorer',
          params: { currentFolderId: file.id }
        }
      });
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
  
  // Handle file double click
  const handleFileDoubleClick = (file: File) => {
    openFile(file);
  };
  
  return (
    <div 
      className="h-screen w-screen overflow-hidden relative"
      onClick={handleDesktopClick}
      onContextMenu={(e) => handleContextMenu(e, 'desktop')}
    >
      {/* Dynamic Wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${wallpapers[currentWallpaper]})` }}
      >
        <div className={`absolute inset-0 ${isNightMode ? 'bg-black/40' : 'bg-white/10'}`} />
      </div>
      
      {/* Desktop icons */}
      <div className="absolute inset-0 pt-16 pb-24 px-4 grid grid-cols-12 gap-2 content-start">
        {desktopFiles.map((file) => (
          <div className="col-span-1" key={file.id}>
            <DesktopIcon
              file={file}
              onDoubleClick={() => handleFileDoubleClick(file)}
              onContextMenu={(e) => handleContextMenu(e, 'file', file.id)}
            />
          </div>
        ))}
      </div>
      
      {/* Windows */}
      {windows.map((window) => (
        <Window
          key={window.id}
          window={window}
        />
      ))}
      
      {/* Dock */}
      <Dock />
      
      {/* Taskbar */}
      <TaskBar onWallpaperChange={() => setCurrentWallpaper((prev) => (prev + 1) % wallpapers.length)} />
      
      {/* Context Menu */}
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          type={contextMenu.type}
          fileId={contextMenu.fileId}
          onCreateNewFile={() => createNewFile('file')}
          onCreateNewFolder={() => createNewFile('folder')}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        />
      )}
    </div>
  );
};

export default Desktop;