import React, { useState, useEffect } from 'react';
import { useSystem } from '../context/SystemContext';
import { BellIcon, SunIcon, MoonIcon, ImageIcon, UserIcon } from 'lucide-react';

interface TaskBarProps {
  onWallpaperChange: () => void;
}

const TaskBar: React.FC<TaskBarProps> = ({ onWallpaperChange }) => {
  const { state, dispatch } = useSystem();
  const { notifications, isNightMode, user } = state;
  
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadNotifications = notifications.filter(n => !n.isRead);
  
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 60000);
    
    return () => clearInterval(timerId);
  }, []);
  
  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
  
  const toggleNightMode = () => {
    dispatch({ type: 'TOGGLE_NIGHT_MODE' });
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  const markAsRead = (notificationId: string) => {
    dispatch({ 
      type: 'MARK_NOTIFICATION_READ', 
      payload: { notificationId } 
    });
  };
  
  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      dispatch({ type: 'LOGOUT_USER' });
    }
  };
  
  return (
    <div className="fixed top-0 w-full flex justify-between items-center px-4 py-1 bg-white/20 backdrop-blur-md border-b border-white/30 text-gray-800 dark:bg-gray-900/40 dark:border-gray-800/50 dark:text-white z-50">
      {/* Left section */}
      <div className="select-none">
        <span className="font-semibold">ATHX</span>
      </div>
      
      {/* Center section - Username */}
      <div className="flex items-center space-x-2">
        <UserIcon size={16} className="text-blue-500" />
        <span className="text-sm font-medium">{user?.username}</span>
      </div>
      
      {/* Right section */}
      <div className="flex items-center space-x-4">
        <button 
          className="p-1.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
          onClick={onWallpaperChange}
          title="Change Wallpaper"
        >
          <ImageIcon size={18} />
        </button>
        
        <div className="relative">
          <button 
            className="relative p-1.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
            onClick={toggleNotifications}
          >
            <BellIcon size={18} />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {unreadNotifications.length}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-medium">Notifications</h3>
                {unreadNotifications.length > 0 && (
                  <button 
                    className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400"
                    onClick={() => unreadNotifications.forEach(n => markAsRead(n.id))}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                        !notification.isRead 
                          ? 'bg-blue-50 dark:bg-blue-900/20' 
                          : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(notification.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {notification.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <button 
          className="p-1.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
          onClick={toggleNightMode}
        >
          {isNightMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>
        
        <button
          className="text-sm text-red-500 hover:text-red-600 dark:text-red-400"
          onClick={handleLogout}
        >
          Logout
        </button>
        
        <div className="text-right">
          <div className="text-sm font-medium">{formattedTime}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
};

export default TaskBar;