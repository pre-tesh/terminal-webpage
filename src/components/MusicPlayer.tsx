
import React, { useState } from 'react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const tracks = [
    'ambient-coding-01.mp3',
    'terminal-beats.mp3',
    'kernel-compilation.mp3',
    'low-level-vibes.mp3'
  ];

  return (
    <div className="text-green-400 font-mono">
      <div className="border border-green-400 p-4 rounded">
        <div className="text-center mb-2">♪ Terminal Music Player ♪</div>
        <div className="text-center mb-2">
          Now playing: {tracks[currentTrack]}
        </div>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length)}
            className="hover:text-cyan-300"
          >
            ⏮
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="hover:text-cyan-300"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button 
            onClick={() => setCurrentTrack((prev) => (prev + 1) % tracks.length)}
            className="hover:text-cyan-300"
          >
            ⏭
          </button>
        </div>
        <div className="mt-2 text-center text-sm">
          Track {currentTrack + 1} of {tracks.length}
        </div>
      </div>
    </div>
  );
};
