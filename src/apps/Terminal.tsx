import React, { useState, useEffect, useRef } from 'react';

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>([
    'WebOS Terminal v1.0.0',
    'Type "help" to see available commands',
    ''
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Commands
  const commands: Record<string, { action: (args: string[]) => string, description: string }> = {
    help: {
      action: () => {
        let output = 'Available commands:\n\n';
        Object.keys(commands).forEach(cmd => {
          output += `${cmd.padEnd(10)} - ${commands[cmd].description}\n`;
        });
        return output;
      },
      description: 'Show this help message'
    },
    clear: {
      action: () => {
        setHistory([]);
        return '';
      },
      description: 'Clear terminal screen'
    },
    echo: {
      action: (args) => args.join(' '),
      description: 'Print text to terminal'
    },
    date: {
      action: () => new Date().toString(),
      description: 'Display current date and time'
    },
    ls: {
      action: () => 'documents/\nimages/\nprojects/\nREADME.txt',
      description: 'List files in current directory'
    },
    whoami: {
      action: () => 'user',
      description: 'Display current user'
    },
    pwd: {
      action: () => '/home/user',
      description: 'Print working directory'
    }
  };
  
  // Execute command
  const executeCommand = (cmd: string) => {
    // Skip empty commands
    if (!cmd.trim()) {
      return setHistory([...history, '$ ']);
    }
    
    const [command, ...args] = cmd.trim().split(' ');
    
    // Add command to history
    setHistory([...history, `$ ${cmd}`]);
    
    // Update command history for up/down navigation
    setCommandHistory([...commandHistory, cmd]);
    setHistoryIndex(-1);
    
    // Execute command
    if (commands[command]) {
      const output = commands[command].action(args);
      if (output) {
        setHistory(prev => [...prev, output]);
      }
    } else {
      setHistory(prev => [...prev, `Command not found: ${command}. Type "help" for available commands.`]);
    }
    
    // Add empty prompt line
    setTimeout(() => {
      setHistory(prev => [...prev, '']);
    }, 10);
    
    // Clear input
    setInput('');
  };
  
  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };
  
  // Auto-focus input when terminal is clicked
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };
  
  // Scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);
  
  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  return (
    <div 
      className="h-full bg-gray-900 text-green-500 p-4 font-mono text-sm overflow-hidden flex flex-col"
      onClick={handleTerminalClick}
    >
      <div 
        ref={terminalRef}
        className="flex-1 overflow-auto"
      >
        {history.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {index === history.length - 1 && line === '' ? (
              <span>$ <span className="inline-block animate-pulse">_</span></span>
            ) : (
              line
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-2 flex items-center">
        <span className="mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-green-500"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default Terminal;