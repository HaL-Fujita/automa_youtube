import React from 'react';
import { Img, staticFile } from 'remotion';
import { z } from 'zod';

/**
 * ポヨンポヨン跳ねるゆっくりキャラクターアニメーションテンプレート
 *
 * 特徴:
 * - 自然なバウンスアニメーション
 * - Y軸スケールによるゆっくり特有の動き
 * - カスタマイズ可能なパラメータ
 * - 商用利用可能
 */

export interface BouncingYukkuriCharacterProps {
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
  /** バウンス速度 (デフォルト: 1.6) */
  bounceSpeed?: number;
  /** バウンスの高さ (px, デフォルト: 20) */
  bounceHeight?: number;
  /** Y軸スケールの強度 (デフォルト: 0.06) */
  scaleIntensity?: number;
  /** Z-index (デフォルト: 20) */
  zIndex?: number;
  /** 顔画像のパス */
  faceImagePath: string;
  /** 目画像のパス */
  eyeImagePath: string;
  /** 口画像のパス */
  mouthImagePath: string;
  /** アニメーション開始フレーム (デフォルト: 30) */
  startFrame?: number;
  /** 呼吸アニメーションの有効/無効 (デフォルト: false) */
  breathingEnabled?: boolean;
  /** 呼吸アニメーションの強度 (デフォルト: 2.0) */
  breathingIntensity?: number;
  /** 呼吸アニメーションの速度 (デフォルト: 0.08) */
  breathingSpeed?: number;
}

/**
 * ポヨンポヨン跳ねるゆっくりキャラクター
 *
 * @example
 * ```tsx
 * <BouncingYukkuriCharacter
 *   left={100}
 *   bottom={50}
 *   width={300}
 *   height={300}
 *   frame={frame}
 *   faceImagePath="yukkuri_character/face.png"
 *   eyeImagePath="yukkuri_character/eyes_open.png"
 *   mouthImagePath="yukkuri_character/mouth_close.png"
 * />
 * ```
 */
export const BouncingYukkuriCharacter: React.FC<BouncingYukkuriCharacterProps> = ({
  left,
  bottom,
  width,
  height,
  scale = 1,
  frame,
  fps = 30,
  bounceSpeed = 1.6,
  bounceHeight = 20,
  scaleIntensity = 0.06,
  zIndex = 20,
  faceImagePath,
  eyeImagePath,
  mouthImagePath,
  startFrame = 30,
  breathingEnabled = false,
  breathingIntensity = 2.0,
  breathingSpeed = 0.08,
}) => {
  // アニメーション進行度の計算
  const progress = Math.max(0, (frame - startFrame) / fps);

  // バウンスアニメーション
  const bounceY = Math.abs(Math.sin(progress * Math.PI * 2 * bounceSpeed)) * bounceHeight;

  // Y軸スケールアニメーション（ゆっくり特有の動き）
  const bounceScaleY = 1 + Math.sin(progress * Math.PI * 2 * bounceSpeed + Math.PI / 2) * scaleIntensity;

  // 呼吸アニメーション
  const breathingY = breathingEnabled
    ? Math.sin(frame * breathingSpeed) * breathingIntensity
    : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left,
        bottom: bottom + bounceY + breathingY,
        width,
        height,
        transform: `scale(${scale}) scaleY(${bounceScaleY})`,
        transformOrigin: 'bottom center',
        zIndex,
      }}
    >
      {/* フェイスベース */}
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
        src={staticFile(eyeImagePath)}
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
        src={staticFile(mouthImagePath)}
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
 * 設定可能なパラメータの説明
 */
export interface BouncingAnimationParams {
  /** バウンス速度: 値が大きいほど速く跳ねる (推奨: 0.8-3.0) */
  bounceSpeed: number;
  /** バウンスの高さ: 跳ねる高さのピクセル数 (推奨: 10-50) */
  bounceHeight: number;
  /** スケール強度: Y軸の変形の強さ (推奨: 0.02-0.1) */
  scaleIntensity: number;
  /** 呼吸アニメーションの有効/無効 */
  breathingEnabled: boolean;
  /** 呼吸の強度: Y軸移動の幅(px) (推奨: 1-4) */
  breathingIntensity: number;
  /** 呼吸の速度: アニメーション速度 (推奨: 0.05-0.12) */
  breathingSpeed: number;
}

/**
 * 推奨パラメータプリセット
 */
export const BOUNCING_PRESETS: Record<string, BouncingAnimationParams> = {
  gentle: {
    bounceSpeed: 1.2,
    bounceHeight: 15,
    scaleIntensity: 0.04,
    breathingEnabled: false,
    breathingIntensity: 1.5,
    breathingSpeed: 0.06,
  },
  normal: {
    bounceSpeed: 1.6,
    bounceHeight: 20,
    scaleIntensity: 0.06,
    breathingEnabled: false,
    breathingIntensity: 2.0,
    breathingSpeed: 0.08,
  },
  energetic: {
    bounceSpeed: 2.2,
    bounceHeight: 30,
    scaleIntensity: 0.08,
    breathingEnabled: false,
    breathingIntensity: 2.5,
    breathingSpeed: 0.1,
  },
  hyperactive: {
    bounceSpeed: 3.0,
    bounceHeight: 40,
    scaleIntensity: 0.1,
    breathingEnabled: false,
    breathingIntensity: 3.0,
    breathingSpeed: 0.12,
  },
  // 呼吸アニメーション専用プリセット
  breathingOnly: {
    bounceSpeed: 0,
    bounceHeight: 0,
    scaleIntensity: 0,
    breathingEnabled: true,
    breathingIntensity: 3.0,
    breathingSpeed: 0.08,
  },
  breathingGentle: {
    bounceSpeed: 0,
    bounceHeight: 0,
    scaleIntensity: 0,
    breathingEnabled: true,
    breathingIntensity: 1.5,
    breathingSpeed: 0.06,
  },
  breathingFast: {
    bounceSpeed: 0,
    bounceHeight: 0,
    scaleIntensity: 0,
    breathingEnabled: true,
    breathingIntensity: 2.0,
    breathingSpeed: 0.12,
  },
};

/**
 * BouncingYukkuriCharacter用zodスキーマ
 * Remotion Studioでパラメータ調整可能
 */
export const BouncingYukkuriCharacterSchema = z.object({
  left: z.number().min(0).max(1920).describe('Character left position (px)'),
  bottom: z.number().min(0).max(1080).describe('Character bottom position (px)'),
  width: z.number().min(50).max(800).describe('Character width (px)'),
  height: z.number().min(50).max(800).describe('Character height (px)'),
  scale: z.number().min(0.1).max(5).describe('Character scale multiplier'),
  frame: z.number().min(0).describe('Current frame number'),
  fps: z.number().min(1).max(60).describe('Frames per second'),
  bounceSpeed: z.number().min(0).max(5).describe('Bounce speed multiplier'),
  bounceHeight: z.number().min(0).max(100).describe('Bounce height (px)'),
  scaleIntensity: z.number().min(0).max(0.2).describe('Y-axis scale intensity'),
  zIndex: z.number().min(0).max(100).describe('Z-index layer'),
  faceImagePath: z.string().describe('Face image path (relative to public/)'),
  eyeImagePath: z.string().describe('Eye image path (relative to public/)'),
  mouthImagePath: z.string().describe('Mouth image path (relative to public/)'),
  startFrame: z.number().min(0).describe('Animation start frame'),
  breathingEnabled: z.boolean().describe('Enable breathing animation'),
  breathingIntensity: z.number().min(0).max(10).describe('Breathing intensity (px)'),
  breathingSpeed: z.number().min(0).max(0.3).describe('Breathing speed'),
});

/**
 * デフォルトprops
 */
export const BouncingYukkuriCharacterDefaultProps = {
  scale: 1,
  fps: 30,
  bounceSpeed: 1.6,
  bounceHeight: 20,
  scaleIntensity: 0.06,
  zIndex: 20,
  startFrame: 30,
  breathingEnabled: false,
  breathingIntensity: 2.0,
  breathingSpeed: 0.08,
};

export default BouncingYukkuriCharacter;