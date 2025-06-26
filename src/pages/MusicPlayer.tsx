
import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, ExternalLink } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(75);

  const tracks = [
    { name: 'Terminal Beats', duration: '3:45', artist: 'CodeFlow' },
    { name: 'Kernel Compilation', duration: '4:12', artist: 'SystemSound' },
    { name: 'Low Level Vibes', duration: '3:28', artist: 'AssemblyMusic' },
    { name: 'Debugging Sessions', duration: '5:03', artist: 'DevTunes' },
    { name: 'Midnight Coding', duration: '3:57', artist: 'TerminalBeats' }
  ];

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white">
      {/* Header with Apple Music Link */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-mono text-green-400">Terminal Music Player</h1>
          <a 
            href="https://music.apple.com/profile/pritesh-kernel" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 px-4 py-2 rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-200"
          >
            <ExternalLink size={18} />
            My Apple Music
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        {/* Main Player */}
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 mb-8">
          {/* Current Track Display */}
          <div className="text-center mb-8">
            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-green-400 to-cyan-500 rounded-lg mb-6 flex items-center justify-center">
              <div className="text-black text-6xl font-mono">♪</div>
            </div>
            <h2 className="text-3xl font-bold mb-2">{tracks[currentTrack].name}</h2>
            <p className="text-gray-400 text-lg">{tracks[currentTrack].artist}</p>
            <p className="text-green-400 font-mono">{tracks[currentTrack].duration}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-cyan-500 h-2 rounded-full w-1/3"></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>1:23</span>
              <span>{tracks[currentTrack].duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <button onClick={prevTrack} className="p-3 hover:bg-gray-700 rounded-full transition-colors">
              <SkipBack size={24} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-green-500 p-4 rounded-full hover:bg-green-600 transition-colors"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <button onClick={nextTrack} className="p-3 hover:bg-gray-700 rounded-full transition-colors">
              <SkipForward size={24} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-center gap-4">
            <Volume2 size={20} />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-32 accent-green-500"
            />
            <span className="text-sm text-gray-400 w-8">{volume}%</span>
          </div>
        </div>

        {/* Playlist */}
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
          <h3 className="text-xl font-bold mb-4 text-green-400">Coding Playlist</h3>
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <div 
                key={index}
                onClick={() => setCurrentTrack(index)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  index === currentTrack 
                    ? 'bg-green-500/20 border border-green-500/50' 
                    : 'hover:bg-gray-700/50'
                }`}
              >
                <div>
                  <div className="font-semibold">{track.name}</div>
                  <div className="text-sm text-gray-400">{track.artist}</div>
                </div>
                <div className="text-sm text-gray-400 font-mono">{track.duration}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Terminal */}
        <div className="text-center mt-8">
          <button 
            onClick={() => window.close()}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors font-mono"
          >
            Close Player
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
