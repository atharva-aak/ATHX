import React from 'react';
import { useSystem } from '../context/SystemContext';
import DynamicIcon from './DynamicIcon';

const Dock: React.FC = () => {
  const { state, dispatch } = useSystem();
  const { apps, windows } = state;
  
  // Open an app
  const handleAppClick = (appId: string) => {
    // Check if app is already open
    const existingWindow = windows.find(w => w.component === apps.find(a => a.id === appId)?.component);
    
    if (existingWindow && existingWindow.isMinimized) {
      // Maximize if minimized
      dispatch({ type: 'MAXIMIZE_WINDOW', payload: { windowId: existingWindow.id } });
    } else if (existingWindow) {
      // Bring to front if already open
      dispatch({ type: 'SET_ACTIVE_WINDOW', payload: { windowId: existingWindow.id } });
    } else {
      // Open new window
      dispatch({ type: 'OPEN_WINDOW', payload: { appId } });
    }
  };
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
      <div className="flex items-center bg-white/20 backdrop-blur-md rounded-2xl px-2 py-1 shadow-lg border border-white/30 dark:bg-gray-800/40 dark:border-gray-700/50">
        {apps.map((app) => {
          const isOpen = windows.some(w => w.component === app.component && !w.isMinimized);
          const isActive = windows.some(w => w.component === app.component && w.isActive);
          
          return (
            <button
              key={app.id}
              className={`relative mx-1 p-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-100 dark:bg-blue-900/50 scale-105' 
                  : isOpen 
                    ? 'bg-gray-100 dark:bg-gray-700/50' 
                    : 'hover:bg-gray-100/70 dark:hover:bg-gray-700/30'
              }`}
              onClick={() => handleAppClick(app.id)}
            >
              <DynamicIcon 
                name={app.icon} 
                size={36} 
                className={`${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`} 
              />
              
              {/* Indicator dot for open apps */}
              {isOpen && !isActive && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;