import React, { useState, useEffect } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number | null>(null);
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDecimal();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        handleOperator(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
      } else if (e.key === 'Escape') {
        clearAll();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, firstOperand, operator, waitingForSecondOperand]);
  
  const clearAll = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };
  
  const handleBackspace = () => {
    if (waitingForSecondOperand) return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };
  
  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };
  
  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };
  
  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);
    
    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplay(String(result));
      setFirstOperand(result);
      
      // Add to history
      setHistory(prev => [...prev, `${firstOperand} ${operator} ${inputValue} = ${result}`]);
    }
    
    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  const performCalculation = (): number => {
    const inputValue = parseFloat(display);
    
    if (firstOperand === null || operator === null) {
      return inputValue;
    }
    
    let result = 0;
    switch (operator) {
      case '+':
        result = firstOperand + inputValue;
        break;
      case '-':
        result = firstOperand - inputValue;
        break;
      case '*':
        result = firstOperand * inputValue;
        break;
      case '/':
        result = firstOperand / inputValue;
        break;
      default:
        return inputValue;
    }
    
    return Number(result.toFixed(8));
  };
  
  const handleEquals = () => {
    if (firstOperand === null || operator === null) return;
    
    const result = performCalculation();
    
    // Add to history
    setHistory(prev => [...prev, `${firstOperand} ${operator} ${display} = ${result}`]);
    
    setDisplay(String(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(true);
  };
  
  const handleMemoryOperation = (operation: 'MC' | 'MR' | 'M+' | 'M-') => {
    const currentValue = parseFloat(display);
    
    switch (operation) {
      case 'MC':
        setMemory(null);
        break;
      case 'MR':
        if (memory !== null) {
          setDisplay(String(memory));
          setWaitingForSecondOperand(true);
        }
        break;
      case 'M+':
        setMemory((memory || 0) + currentValue);
        setWaitingForSecondOperand(true);
        break;
      case 'M-':
        setMemory((memory || 0) - currentValue);
        setWaitingForSecondOperand(true);
        break;
    }
  };
  
  const buttonClass = "h-14 font-medium rounded-lg text-lg focus:outline-none active:scale-95 transition-transform";
  const numberButtonClass = `${buttonClass} bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white`;
  const operatorButtonClass = `${buttonClass} bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 dark:text-white`;
  const specialButtonClass = `${buttonClass} bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white`;
  const memoryButtonClass = `${buttonClass} bg-purple-100 hover:bg-purple-200 dark:bg-purple-800/30 dark:hover:bg-purple-700/30 dark:text-white text-sm`;
  
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 p-4">
      {/* History */}
      <div className="mb-4 flex-shrink-0 h-20 overflow-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
        {history.map((entry, index) => (
          <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
            {entry}
          </div>
        ))}
      </div>
      
      {/* Display */}
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {memory !== null ? `M = ${memory}` : 'No memory stored'}
        </div>
        <div className="text-3xl font-medium truncate dark:text-white">
          {display}
        </div>
      </div>
      
      {/* Memory buttons */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        <button className={memoryButtonClass} onClick={() => handleMemoryOperation('MC')}>MC</button>
        <button className={memoryButtonClass} onClick={() => handleMemoryOperation('MR')}>MR</button>
        <button className={memoryButtonClass} onClick={() => handleMemoryOperation('M+')}>M+</button>
        <button className={memoryButtonClass} onClick={() => handleMemoryOperation('M-')}>M-</button>
      </div>
      
      {/* Keypad */}
      <div className="flex-1 grid grid-cols-4 gap-2">
        <button className={specialButtonClass} onClick={clearAll}>AC</button>
        <button className={specialButtonClass} onClick={handleBackspace}>⌫</button>
        <button className={specialButtonClass} onClick={() => setDisplay(String(parseFloat(display) * -1))}>±</button>
        <button className={operatorButtonClass} onClick={() => handleOperator('/')}>÷</button>
        
        <button className={numberButtonClass} onClick={() => inputDigit('7')}>7</button>
        <button className={numberButtonClass} onClick={() => inputDigit('8')}>8</button>
        <button className={numberButtonClass} onClick={() => inputDigit('9')}>9</button>
        <button className={operatorButtonClass} onClick={() => handleOperator('*')}>×</button>
        
        <button className={numberButtonClass} onClick={() => inputDigit('4')}>4</button>
        <button className={numberButtonClass} onClick={() => inputDigit('5')}>5</button>
        <button className={numberButtonClass} onClick={() => inputDigit('6')}>6</button>
        <button className={operatorButtonClass} onClick={() => handleOperator('-')}>−</button>
        
        <button className={numberButtonClass} onClick={() => inputDigit('1')}>1</button>
        <button className={numberButtonClass} onClick={() => inputDigit('2')}>2</button>
        <button className={numberButtonClass} onClick={() => inputDigit('3')}>3</button>
        <button className={operatorButtonClass} onClick={() => handleOperator('+')}>+</button>
        
        <button className={`${numberButtonClass} col-span-2`} onClick={() => inputDigit('0')}>0</button>
        <button className={numberButtonClass} onClick={inputDecimal}>.</button>
        <button className={`${buttonClass} bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500`} onClick={handleEquals}>=</button>
      </div>
    </div>
  );
};

export default Calculator;