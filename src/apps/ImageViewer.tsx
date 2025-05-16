import React from 'react';
import { useSystem } from '../context/SystemContext';
import { ImageIcon } from 'lucide-react';

interface ImageViewerProps {
  fileId?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ fileId }) => {
  const { state } = useSystem();
  
  // Get file from state
  const file = fileId ? state.files.find(f => f.id === fileId) : undefined;
  
  // In a real implementation, we would load the actual image
  // For this demo, we'll just simulate an image viewer with placeholder
  
  if (!file) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <ImageIcon size={48} className="mx-auto mb-2" />
          <p>No image selected</p>
        </div>
      </div>
    );
  }
  
  // Check if it's actually an image file
  if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
        <div className="text-center text-red-500">
          <p>Not an image file: {file.name}</p>
        </div>
      </div>
    );
  }
  
  // For demo purposes, we'll use a placeholder image
  // In a real app, we would load the actual image content
  const placeholderUrl = "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  
  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Image toolbar */}
      <div className="p-2 border-b flex items-center justify-between bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
        <div className="text-sm font-medium dark:text-white">{file.name}</div>
        <div className="text-xs text-gray-500 dark:text-gray-300">
          {new Date(file.modified).toLocaleString()}
        </div>
      </div>
      
      {/* Image content */}
      <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-900 p-4">
        <img
          src={placeholderUrl}
          alt={file.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};

export default ImageViewer;