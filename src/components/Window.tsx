import React, { useState, useRef, useEffect } from 'react';
import { Window as WindowType } from '../types';
import { useSystem } from '../context/SystemContext';
import { X, Minus, Maximize, Minimize } from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import AppLoader from './AppLoader';

interface WindowProps {
  window: WindowType;
}

const Window: React.FC<WindowProps> = ({ window: windowData }) => {
  const { dispatch } = useSystem();
  const { id, title, position, size, isActive, isMinimized, zIndex, icon, isMaximized } = windowData;
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 });
  const [preMaximizeState, setPreMaximizeState] = useState<{
    position: { x: number; y: number };
    size: { width: number; height: number };
  } | null>(null);
  
  const windowRef = useRef<HTMLDivElement>(null);
  
  const handleWindowClick = () => {
    if (!isActive) {
      dispatch({ type: 'SET_ACTIVE_WINDOW', payload: { windowId: id } });
    }
  };
  
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'CLOSE_WINDOW', payload: { windowId: id } });
  };
  
  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'MINIMIZE_WINDOW', payload: { windowId: id } });
  };
  
  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isMaximized) {
      setPreMaximizeState({ position, size });
      dispatch({
        type: 'MAXIMIZE_WINDOW',
        payload: {
          windowId: id,
          position: { x: 0, y: 0 },
          size: {
            width: window.innerWidth,
            height: window.innerHeight - 40 // Account for taskbar
          }
        }
      });
    } else if (preMaximizeState) {
      dispatch({
        type: 'RESTORE_WINDOW',
        payload: {
          windowId: id,
          position: preMaximizeState.position,
          size: preMaximizeState.size
        }
      });
    }
  };
  
  const handleTitlebarMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget || isMaximized) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };
  
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    
    e.stopPropagation();
    setIsResizing(true);
    setResizeStartPos({
      x: e.clientX,
      y: e.clientY
    });
    setResizeStartSize({
      width: size.width,
      height: size.height
    });
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - size.width)),
          y: Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - size.height))
        };
        
        dispatch({
          type: 'UPDATE_WINDOW_POSITION',
          payload: { windowId: id, position: newPosition }
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStartPos.x;
        const deltaY = e.clientY - resizeStartPos.y;
        
        const newSize = {
          width: Math.max(300, Math.min(resizeStartSize.width + deltaX, window.innerWidth - position.x)),
          height: Math.max(200, Math.min(resizeStartSize.height + deltaY, window.innerHeight - position.y))
        };
        
        dispatch({
          type: 'UPDATE_WINDOW_SIZE',
          payload: { windowId: id, size: newSize }
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset, resizeStartPos, resizeStartSize, id, dispatch, position.x, position.y, size.width, size.height]);
  
  if (isMinimized) {
    return null;
  }
  
  return (
    <div
      ref={windowRef}
      className={`absolute bg-white dark:bg-gray-800 ${
        isMaximized ? 'rounded-none' : 'rounded-lg'
      } shadow-xl overflow-hidden flex flex-col
        transform transition-shadow duration-200 ${isActive ? 'shadow-2xl' : 'shadow-lg'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex
      }}
      onClick={handleWindowClick}
    >
      <div
        className={`h-9 px-2 flex items-center justify-between cursor-move
          ${isActive ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-600'}`}
        onMouseDown={handleTitlebarMouseDown}
        onDoubleClick={handleMaximize}
      >
        <div className="flex items-center space-x-2">
          <DynamicIcon name={icon} size={16} className="text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-medium truncate dark:text-white">{title}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            className="h-5 w-5 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500"
            onClick={handleMinimize}
          >
            <Minus size={12} />
          </button>
          <button
            className="h-5 w-5 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500"
            onClick={handleMaximize}
          >
            {isMaximized ? <Minimize size={12} /> : <Maximize size={12} />}
          </button>
          <button
            className="h-5 w-5 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-600"
            onClick={handleClose}
          >
            <X size={12} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto relative">
        <AppLoader appName={windowData.component} params={windowData.params} />
      </div>
      
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          onMouseDown={handleResizeMouseDown}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            className="absolute bottom-1 right-1 fill-current text-gray-400"
          >
            <path d="M0 10L10 0V10H0Z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Window;