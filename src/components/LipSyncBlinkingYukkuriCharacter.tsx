import React from 'react';
import { Img, staticFile } from 'remotion';
import { z } from 'zod';

/**
 * 音声同期口パクと瞬きアニメーション付きゆっくりキャラクターテンプレート
 *
 * 特徴:
 * - 高精度音声同期口パクアニメーション
 * - 自然な瞬きアニメーション
 * - 軽量な呼吸アニメーション
 * - 完全カスタマイズ可能
 * - 商用利用可能
 */

export interface SpeechSegment {
  /** 開始フレーム番号 */
  start: number;
  /** 終了フレーム番号 */
  end: number;
  /** 字幕テキスト（オプション） */
  text?: string;
}

export interface LipSyncBlinkingYukkuriCharacterProps {
  /** キャラクターの左からの位置 (px) */
  left: number;
  /** キャラクターの下からの位置 (px) */
  bottom: number;
  /** キャラクターの幅 (px) */
  width: number;
  /** キャラクターの高さ (px) */
  height: number;
  /** 全体の拡大率 (デフォルト: 1) */
  scale?: number;
  /** 現在のフレーム番号 */
  frame: number;
  /** フレームレート (デフォルト: 30) */
  fps?: number;
  /** Z-index (デフォルト: 20) */
  zIndex?: number;
  /** 顔画像のパス */
  faceImagePath: string;
  /** 目画像のパス（状態別: eyes_open.png, eyes_half.png, eyes_close.png） */
  eyeImageBasePath: string;
  /** 口画像のパス（状態別: mouth_close.png, mouth_half.png, mouth_open.png） */
  mouthImageBasePath: string;
  /** 話している区間の配列 */
  speechSegments?: SpeechSegment[];
  /** 口パクの速度（フレーム数、デフォルト: 4） */
  lipSyncSpeed?: number;
  /** 瞬きの周期（フレーム数、デフォルト: 150） */
  blinkCycle?: number;
  /** 瞬きの開始フレーム（周期内、デフォルト: 130） */
  blinkStartFrame?: number;
  /** 瞬きの継続フレーム数（デフォルト: 15） */
  blinkDuration?: number;
  /** 呼吸アニメーションの有効/無効 (デフォルト: true) */
  breathingEnabled?: boolean;
  /** 呼吸アニメーションの強度 (デフォルト: 1.5) */
  breathingIntensity?: number;
  /** 呼吸アニメーションの速度 (デフォルト: 0.015) */
  breathingSpeed?: number;
}

/**
 * 音声同期口パクと瞬きアニメーション付きゆっくりキャラクター
 *
 * @example
 * ```tsx
 * const speechSegments = [
 *   { start: 30, end: 120, text: "こんにちは！" },
 *   { start: 150, end: 300, text: "ゆっくりしていってね！" }
 * ];
 *
 * <LipSyncBlinkingYukkuriCharacter
 *   left={100}
 *   bottom={50}
 *   width={300}
 *   height={300}
 *   frame={frame}
 *   faceImagePath="yukkuri_character/face.png"
 *   eyeImageBasePath="yukkuri_character/eyes"
 *   mouthImageBasePath="yukkuri_character/mouth"
 *   speechSegments={speechSegments}
 * />
 * ```
 */
export const LipSyncBlinkingYukkuriCharacter: React.FC<LipSyncBlinkingYukkuriCharacterProps> = ({
  left,
  bottom,
  width,
  height,
  scale = 1,
  frame,
  fps = 30,
  zIndex = 20,
  faceImagePath,
  eyeImageBasePath,
  mouthImageBasePath,
  speechSegments = [],
  lipSyncSpeed = 4,
  blinkCycle = 150,
  blinkStartFrame = 130,
  blinkDuration = 15,
  breathingEnabled = true,
  breathingIntensity = 1.5,
  breathingSpeed = 0.015,
}) => {
  // 現在話しているかどうかを判定
  const isSpeaking = speechSegments.some(
    segment => frame >= segment.start && frame < segment.end
  );

  // 口パクアニメーション (話している時のみ)
  const getMouthState = (): 'close' | 'half' | 'open' => {
    if (!isSpeaking) return 'close';

    const cycle = Math.floor(frame / lipSyncSpeed) % 3;
    switch (cycle) {
      case 0: return 'close';
      case 1: return 'half';
      case 2: return 'open';
      default: return 'close';
    }
  };

  // 瞬きアニメーション
  const getEyeState = (): 'open' | 'half' | 'close' => {
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

  // 呼吸アニメーション
  const breathingY = breathingEnabled
    ? Math.sin(frame * breathingSpeed) * breathingIntensity
    : 0;

  const mouthState = getMouthState();
  const eyeState = getEyeState();

  return (
    <div
      style={{
        position: 'absolute',
        left,
        bottom: bottom + breathingY,
        width,
        height,
        transform: `scale(${scale})`,
        transformOrigin: 'bottom center',
        zIndex,
      }}
    >
      {/* 顔ベース */}
      <Img
        src={staticFile(faceImagePath)}
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
        src={staticFile(`${eyeImageBasePath}_${eyeState}.png`)}
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
        src={staticFile(`${mouthImageBasePath}_${mouthState}.png`)}
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

/**
 * 瞬きアニメーションの設定
 */
export interface BlinkAnimationParams {
  /** 瞬きの周期フレーム数: 瞬きの間隔 (推奨: 120-180) */
  blinkCycle: number;
  /** 瞬きの開始フレーム: 周期内での開始タイミング (推奨: 周期の80-90%) */
  blinkStartFrame: number;
  /** 瞬きの継続フレーム数: 瞬きの長さ (推奨: 10-20) */
  blinkDuration: number;
}

/**
 * 口パクアニメーションの設定
 */
export interface LipSyncAnimationParams {
  /** 口パクの速度: フレーム数ごとに口の状態が変化 (推奨: 3-6) */
  lipSyncSpeed: number;
}

/**
 * 呼吸アニメーションの設定
 */
export interface BreathingAnimationParams {
  /** 呼吸アニメーションの有効/無効 */
  enabled: boolean;
  /** 呼吸の強度: Y軸移動の幅(px) (推奨: 1-3) */
  intensity: number;
  /** 呼吸の速度: アニメーション速度 (推奨: 0.01-0.02) */
  speed: number;
}

/**
 * 推奨パラメータプリセット
 */
export const ANIMATION_PRESETS: Record<string, {
  blink: BlinkAnimationParams;
  lipSync: LipSyncAnimationParams;
  breathing: BreathingAnimationParams;
}> = {
  calm: {
    blink: { blinkCycle: 180, blinkStartFrame: 160, blinkDuration: 12 },
    lipSync: { lipSyncSpeed: 5 },
    breathing: { enabled: true, intensity: 1, speed: 0.012 },
  },
  normal: {
    blink: { blinkCycle: 150, blinkStartFrame: 130, blinkDuration: 15 },
    lipSync: { lipSyncSpeed: 4 },
    breathing: { enabled: true, intensity: 1.5, speed: 0.015 },
  },
  energetic: {
    blink: { blinkCycle: 120, blinkStartFrame: 100, blinkDuration: 10 },
    lipSync: { lipSyncSpeed: 3 },
    breathing: { enabled: true, intensity: 2, speed: 0.018 },
  },
  hyperactive: {
    blink: { blinkCycle: 90, blinkStartFrame: 75, blinkDuration: 8 },
    lipSync: { lipSyncSpeed: 2 },
    breathing: { enabled: true, intensity: 2.5, speed: 0.022 },
  },
};

/**
 * 音声セグメント生成ヘルパー関数
 */
export const createSpeechSegment = (
  startTimeSeconds: number,
  endTimeSeconds: number,
  text: string,
  fps: number = 30
): SpeechSegment => ({
  start: Math.floor(startTimeSeconds * fps),
  end: Math.floor(endTimeSeconds * fps),
  text,
});

/**
 * 複数音声セグメント生成ヘルパー関数
 */
export const createSpeechSegments = (
  segments: Array<{
    startTime: number;
    endTime: number;
    text: string;
  }>,
  fps: number = 30
): SpeechSegment[] =>
  segments.map(segment =>
    createSpeechSegment(segment.startTime, segment.endTime, segment.text, fps)
  );

/**
 * LipSyncBlinkingYukkuriCharacter用zodスキーマ
 * Remotion Studioでパラメータ調整可能
 */
export const LipSyncBlinkingYukkuriCharacterSchema = z.object({
  left: z.number().min(0).max(1920).describe('Character left position (px)'),
  bottom: z.number().min(0).max(1080).describe('Character bottom position (px)'),
  width: z.number().min(50).max(800).describe('Character width (px)'),
  height: z.number().min(50).max(800).describe('Character height (px)'),
  scale: z.number().min(0.1).max(5).describe('Character scale multiplier'),
  frame: z.number().min(0).describe('Current frame number'),
  fps: z.number().min(1).max(60).describe('Frames per second'),
  zIndex: z.number().min(0).max(100).describe('Z-index layer'),
  faceImagePath: z.string().describe('Face image path (relative to public/)'),
  eyeImageBasePath: z.string().describe('Eye image base path (without state suffix)'),
  mouthImageBasePath: z.string().describe('Mouth image base path (without state suffix)'),
  lipSyncSpeed: z.number().min(1).max(10).describe('Lip sync speed (frames per cycle)'),
  blinkCycle: z.number().min(60).max(300).describe('Blink cycle frames'),
  blinkStartFrame: z.number().min(0).max(250).describe('Blink start frame in cycle'),
  blinkDuration: z.number().min(5).max(30).describe('Blink duration frames'),
  breathingEnabled: z.boolean().describe('Enable breathing animation'),
  breathingIntensity: z.number().min(0).max(5).describe('Breathing intensity (px)'),
  breathingSpeed: z.number().min(0).max(0.05).describe('Breathing speed'),
});

/**
 * SpeechSegment用zodスキーマ
 */
export const SpeechSegmentSchema = z.object({
  start: z.number().min(0).describe('Start frame number'),
  end: z.number().min(1).describe('End frame number'),
  text: z.string().optional().describe('Subtitle text (optional)'),
});

/**
 * デフォルトprops
 */
export const LipSyncBlinkingYukkuriCharacterDefaultProps = {
  scale: 1,
  fps: 30,
  zIndex: 20,
  speechSegments: [],
  lipSyncSpeed: 4,
  blinkCycle: 150,
  blinkStartFrame: 130,
  blinkDuration: 15,
  breathingEnabled: true,
  breathingIntensity: 1.5,
  breathingSpeed: 0.015,
};

export default LipSyncBlinkingYukkuriCharacter;