import React, { useState, useEffect, useRef } from 'react';
import { TerminalOutput } from './TerminalOutput';
import { TerminalInput } from './TerminalInput';
import { CommandHandler } from './CommandHandler';

export interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: number;
}

export interface DirectoryStructure {
  [key: string]: {
    type: 'directory' | 'file';
    content?: string;
    children?: DirectoryStructure;
  };
}

const Terminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentDirectory, setCurrentDirectory] = useState(['~']);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);

  const fileSystem: DirectoryStructure = {
    '~': {
      type: 'directory',
      children: {
        'projects': {
          type: 'directory',
          children: {
            'kernel-modules': { type: 'file', content: 'Custom Linux kernel modules and drivers - https://github.com/pritesh-kernel/kernel-modules' },
            'system-tools': { type: 'file', content: 'Low-level system utilities in C - https://github.com/pritesh-kernel/system-tools' },
            'bootloader': { type: 'file', content: 'Custom bootloader implementation - https://github.com/pritesh-kernel/bootloader' },
            'memory-allocator': { type: 'file', content: 'Custom memory management system - https://github.com/pritesh-kernel/memory-allocator' }
          }
        },
        'about-me': {
          type: 'directory',
          children: {
            'info.txt': {
              type: 'file',
              content: `=== Pritesh Rodge  ===

Hello I'm a Computer Science undergrad with a deep passion for 
system-level programming and Linux kernel development.

Currently pursuing mentorship  as a Linux Kernel Bug fixing mentee under Shuah Khan through the Linux Foundation,
diving deep into kernel internals and contributing to open source projects.

Areas of focus:
• Linux kernel development
• System programming in C
• Operating systems internals
• Device drivers and kernel modules
• Memory management and process scheduling

"The beauty of computing lies in understanding how the machine 
 thinks at its deepest level - somebody probably ;)."

Current goals:
• Contributing to mainline Linux kernel
• Mastering kernel debugging and development workflows
• Building expertise in low-level system optimization`
            }
          }
        },
        'contact': {
          type: 'directory',
          children: {
            'email.txt': { type: 'file', content: 'rodgepritesh@gmail.com' },
            'github': { type: 'file', content: 'https://github.com/pre-tesh' },
            'linkedin': { type: 'file', content: 'https://www.linkedin.com/in/pr1tesh/' },
            'twitter': { type: 'file', content: 'https://x.com/PriteshRodge' }
          }
        },
        'music': {
          type: 'directory',
          children: {
            'applemusic': { type: 'file', content: 'https://music.apple.com/in/playlist/the-one/pl.u-9N9L2yes153k0G7' },
            'spotify': { type: 'file', content: 'https://open.spotify.com/user/31ntosq7mqswdu64sjsu7wubhbzi?si=685791af94694f92' }
          }
        },
        'blog': {
          type: 'directory',
          children: {
            'medium': { type: 'file', content: 'https://medium.com/@pritesh-kernel' }
          }
        }
      }
    }
  };

  useEffect(() => {
    // Updated welcome message - removed the old portfolio line
    const welcomeLines: TerminalLine[] = [
      // {
      //   id: 'welcome-1',
      //   type: 'output',
      //   content: '═══════════════════════════════════════════════',
      //   timestamp: Date.now()
      // },
      {
        id: 'welcome-2',
        type: 'output',
        content: 'You gotta know your way around the terminal  ☝(ツ)',
        timestamp: Date.now() + 100
      },
      {
        id: 'welcome-3',
        type: 'output',
        content: 'Type "ls" to explore, "help" for commands',
        timestamp: Date.now() + 200
      },
      // {
      //   id: 'welcome-4',
      //   type: 'output',
      //   content: '═══════════════════════════════════════════════',
      //   timestamp: Date.now() + 300
      // },
      {
        id: 'welcome-5',
        type: 'output',
        content: '',
        timestamp: Date.now() + 400
      }
    ];

    setTimeout(() => {
      setLines(welcomeLines);
    }, 1000);
  }, []);

  const addLine = (line: Omit<TerminalLine, 'id'>) => {
    const newLine: TerminalLine = {
      ...line,
      id: `line-${Date.now()}-${Math.random()}`
    };
    setLines(prev => [...prev, newLine]);
  };

  const handleCommand = (command: string) => {
    // Add command to history
    if (command.trim()) {
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
    }

    // Add command line
    addLine({
      type: 'command',
      content: `pritesh@homepage:${currentDirectory.join('/')}$ ${command}`,
      timestamp: Date.now()
    });

    // Process command
    CommandHandler.execute(command, currentDirectory, fileSystem, {
      addLine,
      setCurrentDirectory
    });
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex flex-col items-center justify-center p-4">
      {/* Welcome Title with animated beige gradient */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 font-mono">
          <span className="bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent bg-[length:200%_100%] animate-[gradient-shift_3s_ease-in-out_infinite]">
            Welcome
          </span>
        </h1>
        <div className="h-1 w-32 bg-gradient-to-r from-white to-amber-200 mx-auto rounded-full opacity-60"></div>
      </div>

      <div className="w-full max-w-6xl">
        {/* Terminal Window with Glow Effect */}
        <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden relative">
          {/* Enhanced Glow Effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-lg blur-lg animate-pulse"></div>
          
          <div className="relative bg-gray-900 rounded-lg">
            {/* Terminal Header */}
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700 rounded-t-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-gray-300 text-sm font-mono">
                pritesh@homepage: {currentDirectory.join('/')}
              </div>
              <div className="w-16"></div>
            </div>

            {/* Terminal Content */}
            <div 
              ref={terminalRef}
              className="bg-black min-h-96 max-h-96 overflow-y-auto p-4 font-mono text-green-400 rounded-b-lg"
              style={{ 
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                scrollbarWidth: 'thin',
                scrollbarColor: '#4B5563 #111827'
              }}
            >
              <TerminalOutput lines={lines} />
              <TerminalInput 
                onCommand={handleCommand}
                currentDirectory={currentDirectory}
                commandHistory={commandHistory}
                historyIndex={historyIndex}
                setHistoryIndex={setHistoryIndex}
                fileSystem={fileSystem}
              />
            </div>
          </div>
        </div>

        {/* Subtle footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          Dont be shy ,  Type <span className="text-green-400 font-mono">help</span> for commands :)))
        </div>
      </div>
    </div>
  );
};

export default Terminal;
