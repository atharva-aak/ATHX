import React from 'react';
import Calculator from '../apps/Calculator';
import FileExplorer from '../apps/FileExplorer';
import TextEditor from '../apps/TextEditor';
import Settings from '../apps/Settings';
import Browser from '../apps/Browser';
import Terminal from '../apps/Terminal';
import ImageViewer from '../apps/ImageViewer';

interface AppLoaderProps {
  appName: string;
  params?: Record<string, any>;
}

const AppLoader: React.FC<AppLoaderProps> = ({ appName, params }) => {
  // Map app names to components
  switch (appName) {
    case 'Calculator':
      return <Calculator />;
    case 'FileExplorer':
      return <FileExplorer currentFolderId={params?.currentFolderId} />;
    case 'TextEditor':
      return <TextEditor fileId={params?.fileId} />;
    case 'Settings':
      return <Settings />;
    case 'Browser':
      return <Browser initialUrl={params?.url} />;
    case 'Terminal':
      return <Terminal />;
    case 'ImageViewer':
      return <ImageViewer fileId={params?.fileId} />;
    default:
      return <div className="p-4">App not found: {appName}</div>;
  }
};

export default AppLoader;