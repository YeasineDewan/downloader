import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Clipboard,
  X,
  ArrowRight,
  Loader2,
  PlaySquare,
  Music,
  Instagram,
  Film,
  Globe,
  Clock,
  Trash2,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { PlatformInfo } from '../types';

export interface SearchHistoryItem {
  id: string;
  url: string;
  domain: string;
  platformId?: string;
  timestamp: number;
}

interface DynamicUrlBarProps {
  url: string;
  setUrl: (url: string) => void;
  onAnalyze: (urlToAnalyze?: string) => void;
  isLoading: boolean;
  detectedPlatform?: PlatformInfo;
}

const SEARCH_HISTORY_KEY = 'media_downloader_search_history_v1';
const MAX_HISTORY_ITEMS = 5;

const SAMPLE_LINKS = [
  {
    label: 'YouTube 4K Demo',
    url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    platform: 'youtube',
    badge: '4K · 60fps',
  },
  {
    label: 'Spotify Studio Track',
    url: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
    platform: 'spotify',
    badge: '320k · Hi-Fi',
  },
  {
    label: 'Instagram Reel',
    url: 'https://www.instagram.com/reel/C2i-Q2xrX8_/',
    platform: 'instagram',
    badge: '1080p MP4',
  },
  {
    label: 'Universal Web Site',
    url: 'https://en.wikipedia.org/wiki/Aurora',
    platform: 'generic',
    badge: 'Deep Scraper',
  },
];

export const DynamicUrlBar: React.FC<DynamicUrlBarProps> = ({
  url,
  setUrl,
  onAnalyze,
  isLoading,
  detectedPlatform,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load persistent search history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSearchHistory(parsed.slice(0, MAX_HISTORY_ITEMS));
        }
      }
    } catch (err) {
      console.warn('Failed to load search history from localStorage:', err);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowHistoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to extract clean domain/host
  const getDomainFromUrl = (rawUrl: string): string => {
    try {
      const parsed = new URL(rawUrl);
      return parsed.hostname.replace(/^www\./, '');
    } catch {
      return rawUrl.slice(0, 25);
    }
  };

  // Helper to detect platform ID from URL string
  const getPlatformIdFromUrl = (rawUrl: string): string => {
    const lower = rawUrl.toLowerCase();
    if (lower.includes('youtu')) return 'youtube';
    if (lower.includes('spotify')) return 'spotify';
    if (lower.includes('instagram')) return 'instagram';
    if (lower.includes('tiktok')) return 'tiktok';
    return 'generic';
  };

  // Save URL to persistent search history (up to last 5)
  const saveUrlToHistory = (rawUrl: string) => {
    const trimmed = rawUrl.trim();
    if (!trimmed || trimmed.length < 4) return;

    try {
      const domain = getDomainFromUrl(trimmed);
      const platformId = getPlatformIdFromUrl(trimmed);

      setSearchHistory((prev) => {
        // Remove duplicate if it already exists
        const filtered = prev.filter(
          (item) => item.url.toLowerCase() !== trimmed.toLowerCase()
        );

        const newItem: SearchHistoryItem = {
          id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          url: trimmed,
          domain,
          platformId,
          timestamp: Date.now(),
        };

        const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.warn('Failed to save search history to localStorage:', err);
    }
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
      setSearchHistory([]);
      setShowHistoryDropdown(false);
    } catch (err) {
      console.warn('Failed to clear search history:', err);
    }
  };

  const removeHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setSearchHistory((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.warn('Failed to remove item from search history:', err);
    }
  };

  const handleSelectHistoryItem = (itemUrl: string) => {
    setUrl(itemUrl);
    setShowHistoryDropdown(false);
    saveUrlToHistory(itemUrl);
    onAnalyze(itemUrl);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        saveUrlToHistory(text);
        onAnalyze(text);
      }
    } catch (err) {
      console.warn('Clipboard read error:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && url.trim() && !isLoading) {
      saveUrlToHistory(url);
      onAnalyze(url);
    }
  };

  const handleManualAnalyze = () => {
    if (!url.trim() || isLoading) return;
    saveUrlToHistory(url);
    onAnalyze(url);
  };

  const getPlatformIcon = (platformId?: string) => {
    const id = platformId || detectedPlatform?.id;
    switch (id) {
      case 'youtube':
        return <PlaySquare className="w-3.5 h-3.5 text-red-500 shrink-0" />;
      case 'spotify':
        return <Music className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-pink-500 shrink-0" />;
      case 'tiktok':
        return <Film className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    }
  };

  const formatTimeAgo = (ts: number): string => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto flex flex-col gap-3 relative">
      {/* iOS Style Floating Glass Search Island */}
      <div
        className={`relative rounded-2xl p-1.5 transition-all duration-300 z-30 ${
          isFocused || showHistoryDropdown
            ? 'bg-neutral-900/90 shadow-[0_0_35px_rgba(255,255,255,0.08)] border border-white/20'
            : 'bg-neutral-900/60 shadow-lg border border-white/[0.08]'
        } backdrop-blur-2xl`}
      >
        <div className="flex items-center gap-2 px-3 py-1.5">
          {/* Detected Platform Tag */}
          <div className="flex items-center gap-2 pl-1 pr-2 py-1 text-xs font-medium rounded-lg bg-neutral-800/80 border border-white/5 text-neutral-300 shrink-0 select-none">
            {getPlatformIcon()}
            <span className="hidden sm:inline">
              {detectedPlatform ? detectedPlatform.name : 'Auto-Detect'}
            </span>
          </div>

          {/* Main Input */}
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (searchHistory.length > 0) setShowHistoryDropdown(true);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Paste link from YouTube, Spotify, Instagram, TikTok, or any webpage..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none px-2 py-2 min-w-0"
          />

          {/* History Button Toggle (shows count) */}
          {searchHistory.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistoryDropdown((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors shrink-0 ${
                showHistoryDropdown
                  ? 'bg-neutral-800 text-white border-white/20'
                  : 'bg-neutral-900/70 text-neutral-400 hover:text-neutral-200 border-white/[0.06] hover:bg-neutral-800/80'
              }`}
              title="Recent Analyzed Links (Persistent History)"
            >
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono text-[11px]">{searchHistory.length}</span>
              <ChevronDown
                className={`w-3 h-3 text-neutral-400 transition-transform ${
                  showHistoryDropdown ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}

          {/* Clear Button */}
          {url && (
            <button
              onClick={() => setUrl('')}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Paste from Clipboard Button */}
          <button
            onClick={handlePaste}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-700/80 border border-white/5 rounded-xl transition-colors shrink-0"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste</span>
          </button>

          {/* Analyze / Fetch Button */}
          <button
            onClick={handleManualAnalyze}
            disabled={!url.trim() || isLoading}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shrink-0 transition-all ${
              !url.trim() || isLoading
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-white/5'
                : 'bg-white text-black hover:bg-neutral-100 active:scale-[0.98] shadow-md shadow-white/10'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <span>Extract</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Persistent Search History Floating Dropdown Panel */}
        {showHistoryDropdown && searchHistory.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-[#121318]/95 border border-white/15 rounded-2xl p-2.5 shadow-2xl backdrop-blur-3xl z-50 space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-white/[0.06]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Last 5 Analyzed Links</span>
              </span>
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-red-400 transition-colors lowercase"
                title="Clear all recent history"
              >
                <Trash2 className="w-3 h-3" />
                <span>clear history</span>
              </button>
            </div>

            <div className="space-y-1 pt-1">
              {searchHistory.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectHistoryItem(item.url)}
                  className="group flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 border border-transparent hover:border-white/10 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-neutral-400 w-3 text-right">
                      {idx + 1}
                    </span>
                    <div className="p-1 rounded-lg bg-neutral-800/90 border border-white/5">
                      {getPlatformIcon(item.platformId)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                          {item.domain}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {formatTimeAgo(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate font-mono">
                        {item.url}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-medium text-blue-400 group-hover:inline-block hidden transition-opacity">
                      Quick Open →
                    </span>
                    <button
                      onClick={(e) => removeHistoryItem(item.id, e)}
                      className="p-1 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-700/60 transition-colors"
                      title="Remove from history"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Persistent History Quick-Chips (Always visible quick access to the last 5 links) */}
      {searchHistory.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs px-2 animate-in fade-in duration-300">
          <div className="flex items-center gap-1.5 text-neutral-400 shrink-0 font-medium text-[11px]">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>Recent ({searchHistory.length}):</span>
          </div>

          {searchHistory.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleSelectHistoryItem(item.url)}
              title={item.url}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/[0.08] hover:border-blue-500/30 transition-all text-xs group"
            >
              {getPlatformIcon(item.platformId)}
              <span className="font-mono text-[11px] max-w-[130px] truncate">
                {item.domain}
              </span>
              <span className="text-[9px] text-neutral-400 font-mono group-hover:text-blue-400">
                #{index + 1}
              </span>
            </button>
          ))}

          <button
            onClick={clearHistory}
            className="text-[10px] text-neutral-400 hover:text-red-400 font-mono transition-colors ml-1 px-1.5 py-0.5"
            title="Clear persistent history"
          >
            Clear
          </button>
        </div>
      )}

      {/* Preset Test Links for Immediate Verification */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-neutral-400 px-2">
        <span className="text-neutral-400 shrink-0 text-[11px]">Sample Links:</span>
        {SAMPLE_LINKS.map((sample) => (
          <button
            key={sample.label}
            onClick={() => {
              setUrl(sample.url);
              saveUrlToHistory(sample.url);
              onAnalyze(sample.url);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900/50 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/[0.05] transition-colors"
          >
            <span>{sample.label}</span>
            <span className="text-[10px] text-neutral-400 font-mono">({sample.badge})</span>
          </button>
        ))}
      </div>
    </div>
  );
};
