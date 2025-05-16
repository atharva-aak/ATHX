import React from 'react';
import { useSystem } from '../context/SystemContext';
import { SunIcon, MoonIcon, MonitorIcon } from 'lucide-react';

const Settings: React.FC = () => {
  const { state, dispatch } = useSystem();
  const { isNightMode } = state;
  
  // Toggle night mode
  const toggleNightMode = () => {
    dispatch({ type: 'TOGGLE_NIGHT_MODE' });
  };
  
  // Add test notification
  const addTestNotification = () => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        notification: {
          type: 'info',
          title: 'Test Notification',
          message: 'This is a test notification from Settings.'
        }
      }
    });
  };
  
  return (
    <div className="h-full overflow-auto bg-white dark:bg-gray-800 dark:text-white">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="space-y-6">
          {/* Appearance */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-4">Appearance</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Theme</label>
                <div className="flex space-x-2">
                  <button
                    className={`flex flex-col items-center p-3 rounded-lg border-2 ${
                      !isNightMode 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-600'
                    } transition-colors`}
                    onClick={() => !isNightMode || toggleNightMode()}
                  >
                    <SunIcon size={24} className="mb-2 text-amber-500" />
                    <span className="text-sm">Light</span>
                  </button>
                  
                  <button
                    className={`flex flex-col items-center p-3 rounded-lg border-2 ${
                      isNightMode 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-600'
                    } transition-colors`}
                    onClick={() => isNightMode || toggleNightMode()}
                  >
                    <MoonIcon size={24} className="mb-2 text-indigo-400" />
                    <span className="text-sm">Dark</span>
                  </button>
                  
                  <button
                    className="flex flex-col items-center p-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <MonitorIcon size={24} className="mb-2 text-gray-400" />
                    <span className="text-sm">System (Coming Soon)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* System */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-4">System</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Notifications</label>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  onClick={addTestNotification}
                >
                  Send Test Notification
                </button>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">About</label>
                <div className="p-3 bg-gray-100 dark:bg-gray-600 rounded-md">
                  <p className="text-sm mb-1">WebOS v1.0.0</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    A virtual operating system that runs entirely in your web browser.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Advanced */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg opacity-75">
            <h2 className="text-lg font-medium mb-4">Advanced (Coming Soon)</h2>
            
            <div className="space-y-4">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md cursor-not-allowed"
                disabled
              >
                Reset All Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;