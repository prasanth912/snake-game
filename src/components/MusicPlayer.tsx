import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS } from '../constants';
import { Track } from '../types';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Audio playback error:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(Number(e.target.value));
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-[12px] uppercase tracking-[2px] text-text-muted mb-6">Current Session</div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {TRACKS.map((track, index) => (
          <div 
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(true);
            }}
            className={`p-4 border transition-all cursor-pointer rounded-sm ${
              currentTrackIndex === index 
                ? 'bg-neon-cyan/5 border-neon-cyan neon-glow-cyan' 
                : 'border-transparent hover:border-white/10 opacity-60'
            }`}
          >
            <span className="block font-bold text-sm mb-1">{track.title}</span>
            <span className="text-[11px] text-text-muted font-mono">{track.artist} // 03:42</span>
          </div>
        ))}
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      {/* Basic Player Controls at bottom of sidebar */}
      <div className="mt-auto pt-8 border-t border-white/5">
        <div className="w-full h-1 bg-white/5 mb-6 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-neon-cyan shadow-[0_0_10px_#00F0FF]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={prevTrack}
            className="text-text-muted hover:text-text-main transition-colors text-[10px] font-mono tracking-widest uppercase"
          >
            Prev
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full border border-neon-cyan flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-text-muted hover:text-text-main transition-colors text-[10px] font-mono tracking-widest uppercase"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export default MusicPlayer;
