import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Maximize,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { DownloadTask, MediaAnalysisResult } from '../types';

interface MediaPlayerModalProps {
  media: MediaAnalysisResult | DownloadTask | null;
  onClose: () => void;
}

export const MediaPlayerModal: React.FC<MediaPlayerModalProps> = ({ media, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(14);
  const [duration, setDuration] = useState(224);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(85);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => (prev >= duration ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  if (!media) return null;

  const title = media.title;
  const author = media.author;
  const thumbnail = media.thumbnail;
  const isAudioOnly =
    ('type' in media && media.type === 'audio') ||
    media.title.toLowerCase().includes('audio') ||
    media.url.includes('spotify') ||
    media.url.includes('soundcloud');

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-2xl bg-neutral-900/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-white/[0.08]">
          <div className="min-w-0 pr-4">
            <h3 className="text-sm font-bold text-white truncate">{title}</h3>
            <p className="text-xs text-neutral-400 truncate">{author}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Canvas */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {isAudioOnly ? (
            <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
              <div
                className={`w-36 h-36 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '8s' }}
              >
                <img
                  src={thumbnail || '/src/assets/images/audio_studio_disc_1791840709109.jpg'}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Dynamic Waveform simulator */}
              <div className="flex items-end gap-1 h-8 mt-2">
                {[14, 28, 18, 32, 22, 10, 26, 30, 16, 24, 32, 12, 22, 18, 28].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-blue-500 to-indigo-400 rounded-full transition-all duration-300"
                    style={{
                      height: isPlaying ? `${Math.min(32, Math.max(6, h + ((currentTime + i) % 15)))}px` : '4px',
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img
                src={thumbnail}
                alt={title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-white" />
                  ) : (
                    <Play className="w-7 h-7 ml-1 fill-white" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Player Controls Bar */}
        <div className="p-5 space-y-4 bg-neutral-950/70 border-t border-white/[0.08]">
          {/* Scrubber slider */}
          <div className="space-y-1.5">
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-neutral-400 font-mono">
              <span>{formatSec(currentTime)}</span>
              <span>{formatSec(duration)}</span>
            </div>
          </div>

          {/* Lower buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-black" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5 fill-black" />
                )}
              </button>

              <button
                onClick={() => setCurrentTime(0)}
                className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
                title="Restart playback"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Volume */}
              <div className="hidden sm:flex items-center gap-2 text-neutral-400 pl-2">
                <button onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-18 h-1 bg-neutral-800 rounded appearance-none"
                />
              </div>
            </div>

            <a
              href={`/api/download?url=${encodeURIComponent(media.url)}&title=${encodeURIComponent(
                title
              )}&format=${isAudioOnly ? 'mp3' : 'mp4'}`}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
