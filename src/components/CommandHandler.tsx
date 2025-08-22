import { DirectoryStructure, TerminalLine } from './Terminal';

interface CommandContext {
  addLine: (line: Omit<TerminalLine, 'id'>) => void;
  setCurrentDirectory: (dir: string[]) => void;
  clearLines: () => void;
}

export class CommandHandler {
  static execute(
    command: string, 
    currentDirectory: string[], 
    fileSystem: DirectoryStructure,
    context: CommandContext
  ) {
     const { addLine, setCurrentDirectory, clearLines } = context;
    const [cmd, ...args] = command.trim().split(' ');

    switch (cmd.toLowerCase()) {
      case 'echo':
        this.handleEcho(args, addLine);
        break;
      
      case 'ls':
        this.handleLs(currentDirectory, fileSystem, addLine);
        break;
      
      case 'cd':
        this.handleCd(args[0] || '~', currentDirectory, fileSystem, addLine, setCurrentDirectory);
        break;
      
      case 'cat':
        this.handleCat(args[0], currentDirectory, fileSystem, addLine);
        break;
      
      case 'open':
        this.handleOpen(args[0], currentDirectory, addLine);
        break;
      
      case 'pwd':
        addLine({
          type: 'output',
          content: currentDirectory.join('/'),
          timestamp: Date.now()
        });
        break;
      
      case 'help':
        this.handleHelp(addLine);
        break;
      
      case 'clear':
        clearLines();
        break;
      
      case 'whoami':
        addLine({
          type: 'output',
          content: 'pritesh',
          timestamp: Date.now()
        });
        break;
      
      case 'sudo':
        this.handleSudo(args, addLine);
        break;
      
      case './play':
        if (currentDirectory[currentDirectory.length - 1] === 'music') {
          setTimeout(() => {
            window.open('/music-player', '_blank');
          }, 500);
          addLine({
            type: 'output',
            content: '🎵 Opening music player in new tab...',
            timestamp: Date.now()
          });
        } else {
          addLine({
            type: 'error',
            content: './play: No such file or directory',
            timestamp: Date.now()
          });
        }
        break;
      
      case 'contact':
        this.handleContact(addLine);
        break;
      
      case '':
        break;
      
      default:
        addLine({
          type: 'error',
          content: `bash: ${cmd}: command not found`,
          timestamp: Date.now()
        });
    }
  }

    private static handleEcho(args: string[], addLine: (line: Omit<TerminalLine, 'id'>) => void) {
    const message = args.join(' ');
    addLine({
      type: 'output',
      content: message,
      timestamp: Date.now()
    });
  }

  private static handleOpen(
    target: string,
    currentDirectory: string[],
    addLine: (line: Omit<TerminalLine, 'id'>) => void
  ) {
    const currentDir = currentDirectory[currentDirectory.length - 1];
    
    // Handle contact links
    if (currentDir === 'contact') {
      const contactUrls: { [key: string]: string } = {
        'github': 'https://github.com/pre-tesh',
        'linkedin': 'https://www.linkedin.com/in/pr1tesh/',
        'twitter': 'https://x.com/PriteshRodge'
      };
      
      if (contactUrls[target]) {
        setTimeout(() => {
          window.open(contactUrls[target], '_blank');
        }, 500);
        addLine({
          type: 'output',
          content: `🔗 Opening ${target}...`,
          timestamp: Date.now()
        });
        return;
      }
    }
    
    // Handle music links
    if (currentDir === 'music') {
      const musicUrls: { [key: string]: string } = {
        'applemusic': 'https://music.apple.com/in/playlist/the-one/pl.u-9N9L2yes153k0G7?ls',
        'spotify': 'https://open.spotify.com/user/31ntosq7mqswdu64sjsu7wubhbzi?si=56be899524a846ab'
      };
      
      if (musicUrls[target]) {
        setTimeout(() => {
          window.open(musicUrls[target], '_blank');
        }, 500);
        addLine({
          type: 'output',
          content: `🎵 Opening ${target}...`,
          timestamp: Date.now()
        });
        return;
      }
    }
    
    // Handle blog links
    if (currentDir === 'blog') {
      if (target === 'medium') {
        setTimeout(() => {
          window.open('https://medium.com/@rodgepritesh', '_blank');
        }, 500);
        addLine({
          type: 'output',
          content: '📝 Opening Medium blog...',
          timestamp: Date.now()
        });
        return;
      }
    }

    if (currentDir === 'about-me') {
      if (target === 'webpage') {
        setTimeout(() => {
          window.open('webpageaboutme.html', '_blank');
        }, 500);
        addLine({
          type: 'output',
          content: '📝 Opening Webpage...',
          timestamp: Date.now()
        });
        return;
      }
    }
    
    // Handle projects (keeping existing functionality)
    if (currentDir === 'projects') {
      const projectUrls: { [key: string]: string } = {
        'kernel-modules': 'https://github.com/pritesh-kernel/kernel-modules',
        'system-tools': 'https://github.com/pritesh-kernel/system-tools',
        'bootloader': 'https://github.com/pritesh-kernel/bootloader',
        'memory-allocator': 'https://github.com/pritesh-kernel/memory-allocator'
      };
      
      if (projectUrls[target]) {
        setTimeout(() => {
          window.open(projectUrls[target], '_blank');
        }, 500);
        addLine({
          type: 'output',
          content: `🚀 Opening ${target} repository...`,
          timestamp: Date.now()
        });
        return;
      }
    }
    
    addLine({
      type: 'error',
      content: `open: ${target}: No such file or directory`,
      timestamp: Date.now()
    });
  }

  private static handleLs(
    currentDirectory: string[], 
    fileSystem: DirectoryStructure, 
    addLine: (line: Omit<TerminalLine, 'id'>) => void
  ) {
    const currentPath = this.getCurrentDirectory(currentDirectory, fileSystem);
    
    if (!currentPath || !currentPath.children) {
      addLine({
        type: 'error',
        content: 'ls: cannot access directory',
        timestamp: Date.now()
      });
      return;
    }

    const items = Object.entries(currentPath.children).map(([name, item]) => {
      return item.type === 'directory' ? `${name}/` : name;
    });

    addLine({
      type: 'output',
      content: items.join('  '),
      timestamp: Date.now()
    });
  }

  private static handleCd(
    target: string,
    currentDirectory: string[],
    fileSystem: DirectoryStructure,
    addLine: (line: Omit<TerminalLine, 'id'>) => void,
    setCurrentDirectory: (dir: string[]) => void
  ) {
    if (target === '~' || target === '') {
      setCurrentDirectory(['~']);
      return;
    }

    if (target === '..') {
      if (currentDirectory.length > 1) {
        setCurrentDirectory(currentDirectory.slice(0, -1));
      }
      return;
    }

    const currentPath = this.getCurrentDirectory(currentDirectory, fileSystem);
    if (!currentPath || !currentPath.children || !currentPath.children[target]) {
      addLine({
        type: 'error',
        content: `bash: cd: ${target}: No such file or directory`,
        timestamp: Date.now()
      });
      return;
    }

    if (currentPath.children[target].type !== 'directory') {
      addLine({
        type: 'error',
        content: `bash: cd: ${target}: Not a directory`,
        timestamp: Date.now()
      });
      return;
    }

    setCurrentDirectory([...currentDirectory, target]);
  }

  private static handleCat(
    filename: string,
    currentDirectory: string[],
    fileSystem: DirectoryStructure,
    addLine: (line: Omit<TerminalLine, 'id'>) => void
  ) {
    if (!filename) {
      addLine({
        type: 'error',
        content: 'cat: missing file operand',
        timestamp: Date.now()
      });
      return;
    }

    const currentPath = this.getCurrentDirectory(currentDirectory, fileSystem);
    if (!currentPath || !currentPath.children || !currentPath.children[filename]) {
      addLine({
        type: 'error',
        content: `cat: ${filename}: No such file or directory`,
        timestamp: Date.now()
      });
      return;
    }

    const file = currentPath.children[filename];
    if (file.type !== 'file') {
      addLine({
        type: 'error',
        content: `cat: ${filename}: Is a directory`,
        timestamp: Date.now()
      });
      return;
    }

    if (file.content) {
      const lines = file.content.split('\n');
      lines.forEach((line, index) => {
        setTimeout(() => {
          addLine({
            type: 'output',
            content: line,
            timestamp: Date.now()
          });
        }, index * 50);
      });
    }
  }

  private static handleHelp(addLine: (line: Omit<TerminalLine, 'id'>) => void) {
    const helpText = [
      'Available commands:',
      '',
      '  ls              List directory contents',
      '  cd <dir>        Change directory',
      '  cat <file>      Display file contents',
      '  open <target>   Open files/projects in new tab',
      '  pwd             Print working directory',
      '  whoami          Display current user',
      '  echo <text>     Display text',
      '  contact         Show contact information',
      '  help            Show this help message',
      '  clear           Clears the terminal ofc .',
      '',
      'Directories to explore:',
      '  projects        My development projects - i have to update this links :-3',
      '  about-me        Personal information and journey',
      '  contact         Ways to reach me',
      '  music           Terminal music player',
      '  blog            My blog posts',
      '',
      'Usage examples:',
      '  cd projects && open kernel-modules',
      '  cd music && open play',
      '  cd blog && open blog'
      ' open webpage'
      ' open applemusic'
    ];

    helpText.forEach((line, index) => {
      setTimeout(() => {
        addLine({
          type: 'output',
          content: line,
          timestamp: Date.now()
        });
      }, index * 30);
    });
  }

  private static handleSudo(
    args: string[],
    addLine: (line: Omit<TerminalLine, 'id'>) => void
  ) {
    const command = args.join(' ');
    
    if (command === 'makemeasandwich') {
      setTimeout(() => {
        addLine({
          type: 'output',
          content: '🥪 There you go! One kernel developer sandwich:',
          timestamp: Date.now()
        });
      }, 500);
      setTimeout(() => {
        addLine({
          type: 'output',
          content: '   - Two slices of C code',
          timestamp: Date.now()
        });
      }, 1000);
      setTimeout(() => {
        addLine({
          type: 'output',
          content: '   - A generous helping of assembly',
          timestamp: Date.now()
        });
      }, 1500);
      setTimeout(() => {
        addLine({
          type: 'output',
          content: '   - Sprinkled with kernel modules',
          timestamp: Date.now()
        });
      }, 2000);
      setTimeout(() => {
        addLine({
          type: 'output',
          content: '   - Served with a side of debugging',
          timestamp: Date.now()
        });
      }, 2500);
    } else {
      addLine({
        type: 'output',
        content: '[sudo] password for pritesh: ',
        timestamp: Date.now()
      });
      setTimeout(() => {
        addLine({
          type: 'error',
          content: 'Sorry, try again.',
          timestamp: Date.now()
        });
      }, 1500);
    }
  }

  private static handleContact(addLine: (line: Omit<TerminalLine, 'id'>) => void) {
    const contactInfo = [
      '═══════════════════════════════════',
      '         Contact Information',
      '═══════════════════════════════════',
      '',
      '📧 Email:    rodgepritesh@gmail.com',
      '🐙 GitHub:   https://github.com/pre-tesh',
      '💼 LinkedIn: https://www.linkedin.com/in/pr1tesh/',
      '',
      'Always open to discussing:',
      '• Kernel development',
      '• Systems programming',
      '• Open source contributions',
      '• LFx mentorship experiences',
      '• Music',
      '• Football',
      '• The big bang theoryy'
    ];

    contactInfo.forEach((line, index) => {
      setTimeout(() => {
        addLine({
          type: 'output',
          content: line,
          timestamp: Date.now()
        });
      }, index * 50);
    });
  }

  private static getCurrentDirectory(currentDirectory: string[], fileSystem: DirectoryStructure) {
    let current = fileSystem['~'];
    
    for (let i = 1; i < currentDirectory.length; i++) {
      if (!current.children || !current.children[currentDirectory[i]]) {
        return null;
      }
      current = current.children[currentDirectory[i]];
    }
    
    return current;
  }

  static getCompletions(input: string, currentDirectory: string[], fileSystem: DirectoryStructure): string[] {
    const parts = input.trim().split(' ');
    const command = parts[0];
    const currentArg = parts[parts.length - 1];

    if (parts.length === 1) {
      const commands = ['ls', 'cd', 'cat', 'open', 'pwd', 'whoami', 'echo', 'contact', 'help', 'clear', 'sudo'];
      return commands.filter(cmd => cmd.startsWith(currentArg));
    }

    if (command === 'cd' || command === 'cat' || command === 'open') {
      const currentPath = this.getCurrentDirectory(currentDirectory, fileSystem);
      if (!currentPath || !currentPath.children) return [];

      const items = Object.entries(currentPath.children).map(([name, item]) => {
        if (command === 'cd' && item.type === 'directory') {
          return name;
        } else if (command === 'cat' && item.type === 'file') {
          return name;
        } else if (command === 'open') {
          return name;
        }
        return null;
      }).filter(Boolean) as string[];

      return items.filter(item => item.startsWith(currentArg));
    }

    return [];
  }
}
