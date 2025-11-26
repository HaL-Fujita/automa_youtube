import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import segmentsWithTelopData from '../public/audio/segments_with_telop.json';
import { Telop } from './components/Telop';

/**
 * おうとまくん解説動画コンポーネント
 * - 音声と完璧に同期した口パクアニメーション
 * - gentle バウンスアニメーション
 * - energetic 口パク
 * - 形態素解析で分割されたテロップ表示
 */

// テロップ行の型定義
interface TelopLine {
  text: string;
  startFrame: number;
  endFrame: number;
  durationFrames: number;
}

// セグメントの型定義
interface SegmentWithTelop {
  index: number;
  text: string;
  audio_file: string;
  duration_seconds: number;
  start_frame: number;
  end_frame: number;
  duration_frames: number;
  telop_lines: TelopLine[];
}

const segments: SegmentWithTelop[] = segmentsWithTelopData as SegmentWithTelop[];

// BOUNCING_PRESETS.gentle
const GENTLE_BOUNCE = {
  bounceSpeed: 1.2,
  bounceHeight: 15,
  scaleIntensity: 0.04,
};

// ANIMATION_PRESETS.energetic.lipSync
const ENERGETIC_LIP_SYNC = {
  lipSyncSpeed: 3,
};

// キャラクターコンポーネント
const OutomakuCharacter: React.FC<{
  frame: number;
  isSpeaking: boolean;
}> = ({ frame, isSpeaking }) => {
  const fps = 30;

  // Gentle バウンスアニメーション
  const progress = frame / fps;
  const bounceY = Math.abs(Math.sin(progress * Math.PI * 2 * GENTLE_BOUNCE.bounceSpeed)) * GENTLE_BOUNCE.bounceHeight;
  const bounceScaleY = 1 + Math.sin(progress * Math.PI * 2 * GENTLE_BOUNCE.bounceSpeed + Math.PI / 2) * GENTLE_BOUNCE.scaleIntensity;

  // Energetic 口パクアニメーション
  const getMouthState = (): 'close' | 'half' | 'open' => {
    if (!isSpeaking) return 'close';
    const cycle = Math.floor(frame / ENERGETIC_LIP_SYNC.lipSyncSpeed) % 3;
    switch (cycle) {
      case 0: return 'close';
      case 1: return 'half';
      case 2: return 'open';
      default: return 'close';
    }
  };

  // 瞬きアニメーション（energeticプリセット: cycle=120, start=100, duration=10）
  const getEyeState = (): 'open' | 'half' | 'close' => {
    const blinkCycle = 120;
    const blinkStartFrame = 100;
    const blinkDuration = 10;
    const blinkFrame = frame % blinkCycle;
    const halfDuration = Math.floor(blinkDuration / 3);

    if (blinkFrame >= blinkStartFrame && blinkFrame < blinkStartFrame + halfDuration) {
      return 'half';
    }
    if (blinkFrame >= blinkStartFrame + halfDuration && blinkFrame < blinkStartFrame + halfDuration * 2) {
      return 'close';
    }
    if (blinkFrame >= blinkStartFrame + halfDuration * 2 && blinkFrame < blinkStartFrame + blinkDuration) {
      return 'half';
    }
    return 'open';
  };

  const mouthState = getMouthState();
  const eyeState = getEyeState();

  return (
    <div
      style={{
        position: 'absolute',
        right: 50,
        bottom: 80 + bounceY,
        width: 350,
        height: 350,
        transform: `scaleY(${bounceScaleY})`,
        transformOrigin: 'bottom center',
        zIndex: 20,
      }}
    >
      {/* 顔ベース */}
      <Img
        src={staticFile('yukkuri_character/face.png')}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          zIndex: 1,
        }}
      />

      {/* 目 */}
      <Img
        src={staticFile(`yukkuri_character/eyes_${eyeState}.png`)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          zIndex: 2,
        }}
      />

      {/* 口 */}
      <Img
        src={staticFile(`yukkuri_character/mouth_${mouthState}.png`)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          zIndex: 2,
        }}
      />
    </div>
  );
};


// メインコンポーネント
export const OutomakuVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // 現在のセグメントを取得
  const currentSegment = segments.find(
    seg => frame >= seg.start_frame && frame < seg.end_frame
  );

  const isSpeaking = !!currentSegment;

  return (
    <AbsoluteFill>
      {/* 背景画像 */}
      <Img
        src={staticFile('background.png')}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      {/* 各音声セグメントを順番に再生 */}
      {segments.map((segment) => (
        <Sequence
          key={`audio-${segment.index}`}
          from={segment.start_frame}
          durationInFrames={segment.duration_frames}
        >
          <Audio src={staticFile(segment.audio_file)} />
        </Sequence>
      ))}

      {/* テロップを1行ずつ順番に表示 */}
      {segments.map((segment) =>
        segment.telop_lines.map((line, lineIndex) => (
          <Sequence
            key={`telop-${segment.index}-${lineIndex}`}
            from={segment.start_frame + line.startFrame}
            durationInFrames={line.durationFrames}
          >
            <Telop
              text={line.text}
              durationFrames={line.durationFrames}
            />
          </Sequence>
        ))
      )}

      {/* キャラクター */}
      <OutomakuCharacter frame={frame} isSpeaking={isSpeaking} />
    </AbsoluteFill>
  );
};

export default OutomakuVideo;
