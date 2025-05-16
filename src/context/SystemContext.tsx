import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Window, AppMetadata, File, Notification, User } from '../types';
import { appRegistry } from '../data/appRegistry';
import { generateInitialFileSystem } from '../data/fileSystem';

type SystemState = {
  windows: Window[];
  apps: AppMetadata[];
  files: File[];
  activeWindowId: string | null;
  notifications: Notification[];
  isNightMode: boolean;
  maxZIndex: number;
  user: User | null;
};

const initialSystemState: SystemState = {
  windows: [],
  apps: appRegistry,
  files: [],
  activeWindowId: null,
  notifications: [],
  isNightMode: false,
  maxZIndex: 0,
  user: null,
};

type SystemAction =
  | { type: 'OPEN_WINDOW'; payload: { appId: string; params?: Record<string, any> } }
  | { type: 'CLOSE_WINDOW'; payload: { windowId: string } }
  | { type: 'MINIMIZE_WINDOW'; payload: { windowId: string } }
  | { type: 'MAXIMIZE_WINDOW'; payload: { windowId: string } }
  | { type: 'SET_ACTIVE_WINDOW'; payload: { windowId: string } }
  | { type: 'UPDATE_WINDOW_POSITION'; payload: { windowId: string; position: { x: number; y: number } } }
  | { type: 'UPDATE_WINDOW_SIZE'; payload: { windowId: string; size: { width: number; height: number } } }
  | { type: 'ADD_NOTIFICATION'; payload: { notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'> } }
  | { type: 'MARK_NOTIFICATION_READ'; payload: { notificationId: string } }
  | { type: 'TOGGLE_NIGHT_MODE' }
  | { type: 'CREATE_FILE'; payload: { file: Omit<File, 'id' | 'created' | 'modified'> } }
  | { type: 'UPDATE_FILE'; payload: { fileId: string; updates: Partial<File> } }
  | { type: 'LOGIN_USER'; payload: { username: string } }
  | { type: 'LOGOUT_USER' };

const SystemContext = createContext<{
  state: SystemState;
  dispatch: React.Dispatch<SystemAction>;
} | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 11);

const systemReducer = (state: SystemState, action: SystemAction): SystemState => {
  switch (action.type) {
    case 'LOGIN_USER': {
      const user: User = {
        id: generateId(),
        username: action.payload.username,
        created: new Date()
      };
      
      // Create initial files for new user
      const initialFiles = generateInitialFileSystem(user.id);
      const files = initialFiles.map(file => ({
        id: generateId(),
        ...file,
        created: new Date(),
        modified: new Date(),
        owner: user.id
      }));
      
      return {
        ...state,
        user,
        files
      };
    }
    
    case 'LOGOUT_USER': {
      return {
        ...initialSystemState,
        apps: state.apps
      };
    }
    
    case 'OPEN_WINDOW': {
      const { appId, params } = action.payload;
      const app = state.apps.find(app => app.id === appId);
      
      if (!app) return state;
      
      const newZIndex = state.maxZIndex + 1;
      const newWindow: Window = {
        id: generateId(),
        title: app.name,
        component: app.component,
        position: { x: 100, y: 100 },
        size: app.defaultSize,
        isActive: true,
        isMinimized: false,
        zIndex: newZIndex,
        icon: app.icon,
        params
      };
      
      return {
        ...state,
        windows: [...state.windows.map(w => ({ ...w, isActive: false })), newWindow],
        activeWindowId: newWindow.id,
        maxZIndex: newZIndex
      };
    }
    
    case 'CLOSE_WINDOW': {
      const { windowId } = action.payload;
      const updatedWindows = state.windows.filter(w => w.id !== windowId);
      
      let newActiveWindowId = state.activeWindowId;
      if (windowId === state.activeWindowId && updatedWindows.length > 0) {
        const highestZWindow = updatedWindows.reduce((prev, curr) => 
          prev.zIndex > curr.zIndex ? prev : curr
        );
        newActiveWindowId = highestZWindow.id;
      } else if (updatedWindows.length === 0) {
        newActiveWindowId = null;
      }
      
      return {
        ...state,
        windows: updatedWindows.map(w => ({
          ...w,
          isActive: w.id === newActiveWindowId
        })),
        activeWindowId: newActiveWindowId
      };
    }
    
    case 'MINIMIZE_WINDOW': {
      const { windowId } = action.payload;
      
      const windowsExceptMinimized = state.windows.filter(w => w.id !== windowId && !w.isMinimized);
      let newActiveWindowId = null;
      
      if (windowsExceptMinimized.length > 0) {
        const highestZWindow = windowsExceptMinimized.reduce((prev, curr) => 
          prev.zIndex > curr.zIndex ? prev : curr
        );
        newActiveWindowId = highestZWindow.id;
      }
      
      return {
        ...state,
        windows: state.windows.map(w => {
          if (w.id === windowId) {
            return { ...w, isMinimized: true, isActive: false };
          }
          return { ...w, isActive: w.id === newActiveWindowId };
        }),
        activeWindowId: newActiveWindowId
      };
    }
    
    case 'MAXIMIZE_WINDOW': {
      const { windowId } = action.payload;
      const newZIndex = state.maxZIndex + 1;
      
      return {
        ...state,
        windows: state.windows.map(w => {
          if (w.id === windowId) {
            return { ...w, isMinimized: false, isActive: true, zIndex: newZIndex };
          }
          return { ...w, isActive: false };
        }),
        activeWindowId: windowId,
        maxZIndex: newZIndex
      };
    }
    
    case 'SET_ACTIVE_WINDOW': {
      const { windowId } = action.payload;
      const newZIndex = state.maxZIndex + 1;
      
      return {
        ...state,
        windows: state.windows.map(w => {
          if (w.id === windowId) {
            return { ...w, isActive: true, zIndex: newZIndex };
          }
          return { ...w, isActive: false };
        }),
        activeWindowId: windowId,
        maxZIndex: newZIndex
      };
    }
    
    case 'UPDATE_WINDOW_POSITION': {
      const { windowId, position } = action.payload;
      
      return {
        ...state,
        windows: state.windows.map(w => {
          if (w.id === windowId) {
            return { ...w, position };
          }
          return w;
        })
      };
    }
    
    case 'UPDATE_WINDOW_SIZE': {
      const { windowId, size } = action.payload;
      
      return {
        ...state,
        windows: state.windows.map(w => {
          if (w.id === windowId) {
            return { ...w, size };
          }
          return w;
        })
      };
    }
    
    case 'ADD_NOTIFICATION': {
      const { notification } = action.payload;
      const newNotification: Notification = {
        id: generateId(),
        ...notification,
        timestamp: new Date(),
        isRead: false
      };
      
      return {
        ...state,
        notifications: [newNotification, ...state.notifications]
      };
    }
    
    case 'MARK_NOTIFICATION_READ': {
      const { notificationId } = action.payload;
      
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      };
    }
    
    case 'TOGGLE_NIGHT_MODE': {
      return {
        ...state,
        isNightMode: !state.isNightMode
      };
    }
    
    case 'CREATE_FILE': {
      const { file } = action.payload;
      const newFile: File = {
        id: generateId(),
        ...file,
        created: new Date(),
        modified: new Date()
      };
      
      return {
        ...state,
        files: [...state.files, newFile]
      };
    }
    
    case 'UPDATE_FILE': {
      const { fileId, updates } = action.payload;
      
      return {
        ...state,
        files: state.files.map(f => {
          if (f.id === fileId) {
            return { ...f, ...updates, modified: new Date() };
          }
          return f;
        })
      };
    }
    
    default:
      return state;
  }
};

export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(systemReducer, initialSystemState);
  
  useEffect(() => {
    if (state.isNightMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isNightMode]);
  
  const value = { state, dispatch };
  
  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};