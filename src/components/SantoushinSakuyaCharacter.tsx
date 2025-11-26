import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { z } from 'zod';

/**
 * 音素タイミング情報インターフェース
 * VOICEVOXなどの音声合成エンジンから取得した音素情報を格納
 */
export interface PhonemeTimingInfo {
  start: number;
  end: number;
  phoneme: string;
}

/**
 * 三頭身咲耶キャラクター アニメーションテンプレート
 *
 * 特徴:
 * - 感情状態（通常・驚き）の切り替え
 * - 音素ベースの正確な口パク同期
 * - 自然な瞬きアニメーション
 * - プリロード対応で滑らかな表示切り替え
 * - 商用利用可能
 */
export interface SantoushinSakuyaCharacterProps {
  /** 感情状態: 'normal'（通常）または 'surprise'（驚き） */
  emotion?: 'normal' | 'surprise';

  /** 左からの位置 (px) */
  left?: number;

  /** 下からの位置 (px) */
  bottom?: number;

  /** 幅 (px) */
  width?: number;

  /** 高さ (px) */
  height?: number;

  /** 全体の拡大率 */
  scale?: number;

  /** 現在のフレーム番号 */
  frame: number;

  /** フレームレート (デフォルト: 30) */
  fps?: number;

  /** Z-index (デフォルト: 10) */
  zIndex?: number;

  // 口パク制御
  /** @deprecated phonemeTimingsを使用してください。指定フレームで口が開く */
  talkingFrames?: number[];

  /** 音素タイミング情報（秒単位）VOICEVOXの音素情報を使った正確な口パク制御 */
  phonemeTimings?: PhonemeTimingInfo[];

  /** 音声の開始フレーム（音素タイミングの基準点） */
  audioStartFrame?: number;

  /** 口パクの強度（0-1, デフォルト: 1）0で閉じ、1で完全に開く */
  lipSyncIntensity?: number;

  // 瞬き制御
  /** 瞬きの有効/無効（デフォルト: true） */
  blinkEnabled?: boolean;

  /** 瞬きの間隔（フレーム単位、デフォルト: 90 = 3秒） */
  blinkInterval?: number;

  /** 瞬きの長さ（フレーム数、デフォルト: 3） */
  blinkDuration?: number;

  /** 瞬きのランダム性（0-1、デフォルト: 0.2）値が大きいほどランダム */
  blinkRandomness?: number;

  // 画像パス設定
  /** ボディ画像のベースパス（emotion部分は自動付加） */
  bodyImageBasePath?: string;

  /** 目画像のベースパス（emotion-state部分は自動付加） */
  eyeImageBasePath?: string;

  /** 口画像のベースパス（emotion-state部分は自動付加） */
  mouthImageBasePath?: string;
}

// Zodスキーマ（Remotion Props検証用）
export const santoushinSakuyaSchema = z.object({
  emotion: z.enum(['normal', 'surprise']).optional(),
  left: z.number().optional(),
  bottom: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  scale: z.number().min(0.1).max(3).optional(),
  frame: z.number(),
  fps: z.number().min(1).optional(),
  zIndex: z.number().optional(),
  talkingFrames: z.array(z.number()).optional(),
  phonemeTimings: z.array(z.object({
    start: z.number(),
    end: z.number(),
    phoneme: z.string(),
  })).optional(),
  audioStartFrame: z.number().optional(),
  lipSyncIntensity: z.number().min(0).max(1).optional(),
  blinkEnabled: z.boolean().optional(),
  blinkInterval: z.number().min(30).optional(),
  blinkDuration: z.number().min(1).max(10).optional(),
  blinkRandomness: z.number().min(0).max(1).optional(),
  bodyImageBasePath: z.string().optional(),
  eyeImageBasePath: z.string().optional(),
  mouthImageBasePath: z.string().optional(),
});

/**
 * SantoushinSakuyaCharacter - 三頭身咲耶キャラクターコンポーネント
 */
export const SantoushinSakuyaCharacter: React.FC<SantoushinSakuyaCharacterProps> = ({
  emotion = 'normal',
  left = 50,
  bottom = 50,
  width = 400,
  height = 400,
  scale = 1,
  frame,
  fps = 30,
  zIndex = 10,
  talkingFrames = [],
  phonemeTimings,
  audioStartFrame = 0,
  lipSyncIntensity = 1,
  blinkEnabled = true,
  blinkInterval = 90,
  blinkDuration = 3,
  blinkRandomness = 0.2,
  bodyImageBasePath = 'santoushin_sakuya/sakuya',
  eyeImageBasePath = 'santoushin_sakuya/sakuya',
  mouthImageBasePath = 'santoushin_sakuya/sakuya',
}) => {
  // ランダム瞬き用のシード値（コンポーネント生成時に一度だけ計算）
  const [blinkSeed] = React.useState(() => Math.random());

  // 画像プリロード
  React.useEffect(() => {
    const imagesToPreload = [
      `${bodyImageBasePath}-normal-body.png`,
      `${eyeImageBasePath}-normal-eye-open.png`,
      `${eyeImageBasePath}-normal-eye-close.png`,
      `${mouthImageBasePath}-normal-mouth-open.png`,
      `${mouthImageBasePath}-normal-mouth-close.png`,
      `${bodyImageBasePath}-surprise-body.png`,
      `${eyeImageBasePath}-surprise-eye-open.png`,
      `${eyeImageBasePath}-surprise-eye-close.png`,
      `${mouthImageBasePath}-surprise-mouth-open.png`,
      `${mouthImageBasePath}-surprise-mouth-close.png`,
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = staticFile(src);
    });
  }, [bodyImageBasePath, eyeImageBasePath, mouthImageBasePath]);

  // 口パク判定ロジック
  const isMouthOpen = React.useMemo(() => {
    if (phonemeTimings && phonemeTimings.length > 0) {
      // 音素タイミングベースの口パク
      const currentTimeInSeconds = (frame - audioStartFrame) / fps;

      // 開口音素をチェック（a, i, u, e, o などの母音）
      const openPhonemes = ['a', 'i', 'u', 'e', 'o', 'A', 'I', 'U', 'E', 'O'];

      return phonemeTimings.some(timing =>
        currentTimeInSeconds >= timing.start &&
        currentTimeInSeconds <= timing.end &&
        openPhonemes.some(p => timing.phoneme.includes(p))
      );
    } else {
      // レガシー方式（フレーム配列指定）
      return talkingFrames.includes(frame);
    }
  }, [frame, phonemeTimings, audioStartFrame, fps, talkingFrames]);

  // 瞬き判定ロジック
  const isBlinking = React.useMemo(() => {
    if (!blinkEnabled) return false;

    // ランダム性を加味した瞬き間隔の計算
    const adjustedInterval = blinkInterval * (1 + (blinkSeed - 0.5) * blinkRandomness);
    const blinkCycle = frame % Math.floor(adjustedInterval);

    return blinkCycle < blinkDuration;
  }, [frame, blinkEnabled, blinkInterval, blinkDuration, blinkRandomness, blinkSeed]);

  // 画像パスの決定
  const bodyImage = `${bodyImageBasePath}-${emotion}-body.png`;
  const eyeImage = isBlinking
    ? `${eyeImageBasePath}-${emotion}-eye-close.png`
    : `${eyeImageBasePath}-${emotion}-eye-open.png`;
  const mouthImage = isMouthOpen
    ? `${mouthImageBasePath}-${emotion}-mouth-open.png`
    : `${mouthImageBasePath}-${emotion}-mouth-close.png`;

  // スタイル定義
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${left}px`,
    bottom: `${bottom}px`,
    width: `${width}px`,
    height: `${height}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'bottom left',
    zIndex,
  };

  const baseLayerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'center center',
  };

  const createPartsLayerStyle = (visible: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'center center',
    opacity: visible ? lipSyncIntensity : 0,
    transition: 'none',
    pointerEvents: 'none',
  });

  return (
    <div style={containerStyle}>
      {/* ベースボディレイヤー */}
      <Img src={staticFile(bodyImage)} style={baseLayerStyle} />

      {/* 目レイヤー（両状態を事前描画） */}
      <Img
        src={staticFile(`${eyeImageBasePath}-${emotion}-eye-open.png`)}
        style={createPartsLayerStyle(!isBlinking)}
      />
      <Img
        src={staticFile(`${eyeImageBasePath}-${emotion}-eye-close.png`)}
        style={createPartsLayerStyle(isBlinking)}
      />

      {/* 口レイヤー（両状態を事前描画） */}
      <Img
        src={staticFile(`${mouthImageBasePath}-${emotion}-mouth-close.png`)}
        style={createPartsLayerStyle(!isMouthOpen)}
      />
      <Img
        src={staticFile(`${mouthImageBasePath}-${emotion}-mouth-open.png`)}
        style={createPartsLayerStyle(isMouthOpen)}
      />
    </div>
  );
};

// プリセット設定
export const SANTOUSHIN_PRESETS = {
  calm: {
    blinkInterval: 120,
    blinkDuration: 4,
    blinkRandomness: 0.3,
    lipSyncIntensity: 0.8,
  },
  normal: {
    blinkInterval: 90,
    blinkDuration: 3,
    blinkRandomness: 0.2,
    lipSyncIntensity: 1,
  },
  energetic: {
    blinkInterval: 60,
    blinkDuration: 2,
    blinkRandomness: 0.4,
    lipSyncIntensity: 1,
  },
  surprise: {
    blinkInterval: 150,
    blinkDuration: 5,
    blinkRandomness: 0.1,
    lipSyncIntensity: 1,
  },
};

/**
 * ユーティリティ関数: 口パクフレームを自動生成
 */
export const generateTalkingFrames = (
  startFrame: number,
  endFrame: number,
  interval: number = 4
): number[] => {
  const frames: number[] = [];
  for (let i = startFrame; i <= endFrame; i += interval) {
    frames.push(i);
  }
  return frames;
};

/**
 * ユーティリティ関数: VOICEVOXの音素データから口パクタイミングを生成
 */
export const convertVoicevoxToPhonemeTimings = (
  voicevoxData: any,
  speedScale: number = 1
): PhonemeTimingInfo[] => {
  if (!voicevoxData || !voicevoxData.phonemes) return [];

  const timings: PhonemeTimingInfo[] = [];
  let currentTime = 0;

  voicevoxData.phonemes.forEach((phoneme: any) => {
    const duration = phoneme.length * speedScale;
    timings.push({
      start: currentTime,
      end: currentTime + duration,
      phoneme: phoneme.phoneme,
    });
    currentTime += duration;
  });

  return timings;
};