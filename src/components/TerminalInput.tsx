import React, { useState, useEffect, useRef } from 'react';
import { CommandHandler } from './CommandHandler';
import { DirectoryStructure } from './Terminal';

interface TerminalInputProps {
  onCommand: (command: string) => void;
  currentDirectory: string[];
  commandHistory: string[];
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
  fileSystem: DirectoryStructure;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  onCommand,
  currentDirectory,
  commandHistory,
  historyIndex,
  setHistoryIndex,
  fileSystem
}) => {
  const [input, setInput] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Keep input focused
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCommand(input);
    setInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleAutoComplete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleAutoComplete = () => {
    const completions = CommandHandler.getCompletions(input, currentDirectory, fileSystem);
    
    if (completions.length === 1) {
      // Single completion - auto-complete it
      const parts = input.trim().split(' ');
      parts[parts.length - 1] = completions[0];
      setInput(parts.join(' ') + ' ');
    } else if (completions.length > 1) {
      // Multiple completions - find common prefix
      const commonPrefix = findCommonPrefix(completions);
      const parts = input.trim().split(' ');
      const currentArg = parts[parts.length - 1];
      
      if (commonPrefix.length > currentArg.length) {
        parts[parts.length - 1] = commonPrefix;
        setInput(parts.join(' '));
      }
    }
  };

  const findCommonPrefix = (strings: string[]): string => {
    if (strings.length === 0) return '';
    if (strings.length === 1) return strings[0];
    
    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
      while (strings[i].indexOf(prefix) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1);
        if (prefix === '') return '';
      }
    }
    return prefix;
  };

  return (
    <div className="flex items-center mt-2">
      <span className="text-cyan-300 mr-2">
        pritesh@homepage:{currentDirectory.join('/')}$
      </span>
      <form onSubmit={handleSubmit} className="flex-1">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none text-green-400 font-mono flex-1 w-full"
          style={{ caretColor: 'transparent' }}
          autoComplete="off"
          spellCheck={false}
        />
      </form>
      <span className={`text-green-400 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
        █
      </span>
    </div>
  );
};
