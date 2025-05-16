import React, { useState, useEffect } from 'react';
import { useSystem } from '../context/SystemContext';
import { Save, AlertCircle } from 'lucide-react';

interface TextEditorProps {
  fileId?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ fileId }) => {
  const { state, dispatch } = useSystem();
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('Untitled.txt');
  const [isSaved, setIsSaved] = useState(true);
  
  // Load file content when component mounts or fileId changes
  useEffect(() => {
    if (fileId) {
      const file = state.files.find(f => f.id === fileId);
      if (file) {
        setText(file.content || '');
        setFileName(file.name);
        setIsSaved(true);
      }
    }
  }, [fileId, state.files]);
  
  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setIsSaved(false);
  };
  
  // Save file
  const handleSave = () => {
    if (fileId) {
      // Update existing file
      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          fileId,
          updates: {
            content: text,
            size: text.length
          }
        }
      });
    } else {
      // Create new file on desktop
      dispatch({
        type: 'CREATE_FILE',
        payload: {
          file: {
            name: fileName,
            type: 'file',
            content: text,
            parentId: null,
            size: text.length
          }
        }
      });
      
      // Show success notification
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          notification: {
            type: 'success',
            title: 'File Saved',
            message: `${fileName} has been saved to desktop.`
          }
        }
      });
    }
    
    setIsSaved(true);
  };
  
  // Handle file name change
  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
    setIsSaved(false);
  };
  
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="p-2 border-b flex items-center justify-between dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={fileName}
            onChange={handleFileNameChange}
            className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          
          {!isSaved && (
            <div className="flex items-center text-xs text-amber-600 dark:text-amber-400">
              <AlertCircle size={12} className="mr-1" />
              Unsaved changes
            </div>
          )}
        </div>
        
        <button
          onClick={handleSave}
          className="p-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Save size={16} />
        </button>
      </div>
      
      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <textarea
          value={text}
          onChange={handleTextChange}
          className="w-full h-full p-4 resize-none focus:outline-none font-mono text-gray-800 dark:bg-gray-800 dark:text-gray-200"
          spellCheck="false"
          placeholder="Start typing..."
        />
      </div>
    </div>
  );
};

export default TextEditor;