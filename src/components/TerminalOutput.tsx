
import React from 'react';
import { TerminalLine } from './Terminal';

interface TerminalOutputProps {
  lines: TerminalLine[];
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ lines }) => {
  const formatContent = (content: string, type: TerminalLine['type']) => {
    if (content.includes('https://')) {
      // Make URLs clickable
      return content.split(' ').map((word, index) => {
        if (word.startsWith('https://')) {
          return (
            <a 
              key={index}
              href={word} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {word}
            </a>
          );
        }
        return word + ' ';
      });
    }
    return content;
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'command':
        return 'text-cyan-300';
      case 'error':
        return 'text-red-400';
      case 'output':
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className="space-y-1">
      {lines.map((line) => (
        <div 
          key={line.id} 
          className={`${getLineColor(line.type)} animate-fade-in`}
          style={{ 
            animationDelay: `${(line.timestamp % 1000) / 1000}s`,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
        >
          {formatContent(line.content, line.type)}
        </div>
      ))}
    </div>
  );
};
