'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio as RadioIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';

interface AudioPlayerProps {
  stationId?: number;
  streamUrl: string;
  stationName: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function AudioPlayer({ streamUrl, stationName, onPlayStateChange }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    if (typeof window !== 'undefined') {
      const audio = new Audio(streamUrl);
      audio.preload = 'none';
      audio.volume = volume / 100;
      audioRef.current = audio;

      audio.addEventListener('play', () => {
        setIsPlaying(true);
        setIsLoading(false);
      });

      audio.addEventListener('pause', () => {
        setIsPlaying(false);
        setIsLoading(false);
      });

      audio.addEventListener('waiting', () => {
        setIsLoading(true);
      });

      audio.addEventListener('canplay', () => {
        setIsLoading(false);
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setIsLoading(false);
        setIsPlaying(false);
      });

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [streamUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    onPlayStateChange?.(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0) {
      setIsMuted(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-secondary via-secondary/95 to-secondary text-white shadow-2xl border-t border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-6">
          {/* Logo & Station Info */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative w-12 h-12">
              <Image
                src="/ecko-logo.svg"
                alt="Ecko Media"
                fill
                className="object-contain rounded-full shadow-lg"
              />
              {isPlaying && (
                <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"></div>
              )}
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-sm">{stationName}</p>
              <p className="text-xs text-white/80">104.3 FM • Freetown, Sierra Leone</p>
            </div>
          </div>

          {/* Live Badge */}
          {isPlaying && (
            <div className="hidden md:flex items-center gap-2 bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/50">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold">LIVE</span>
            </div>
          )}

          {/* Play/Pause Button */}
          <Button
            onClick={togglePlay}
            disabled={isLoading}
            size="lg"
            className="bg-primary text-secondary hover:bg-primary/90 shadow-xl rounded-full w-14 h-14 p-0 flex-shrink-0 font-bold"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </Button>

          {/* Now Playing Animation */}
          {isPlaying && (
            <div className="hidden lg:flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-white rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                  }}
                ></div>
              ))}
            </div>
          )}

          {/* Volume Control */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-white hover:bg-white/10"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
            <div className="w-24">
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-white hover:bg-white/10"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
