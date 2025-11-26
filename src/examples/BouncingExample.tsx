import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  BouncingYukkuriCharacter,
  BOUNCING_PRESETS,
  BouncingYukkuriCharacterSchema,
  BouncingYukkuriCharacterDefaultProps
} from '../components/BouncingYukkuriCharacter';
import { z } from 'zod';

/**
 * ポヨンポヨン跳ねるゆっくりキャラクターの使用例
 *
 * この例では：
 * - 2体のキャラクターが異なる設定で跳ねる
 * - プリセットを使用した簡単な設定
 * - カスタムパラメータでの微調整
 */
/**
 * BouncingExample用zodスキーマ
 */
export const BouncingExampleSchema = z.object({
  backgroundColor: z.string().describe('Background color (hex or named color)'),
  showTitle: z.boolean().describe('Show title text'),
  showLabels: z.boolean().describe('Show character labels'),
  titleText: z.string().describe('Title text content'),
});

export interface BouncingExampleProps {
  backgroundColor?: string;
  showTitle?: boolean;
  showLabels?: boolean;
  titleText?: string;
}

export const BouncingExample: React.FC<BouncingExampleProps> = ({
  backgroundColor = '#87CEEB',
  showTitle = true,
  showLabels = true,
  titleText = 'バウンス＆呼吸アニメーション',
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* 左側：gentleプリセット */}
      <BouncingYukkuriCharacter
        left={200}
        bottom={100}
        width={300}
        height={300}
        frame={frame}
        faceImagePath="yukkuri_character/face.png"
        eyeImagePath="yukkuri_character/eyes_open.png"
        mouthImagePath="yukkuri_character/mouth_close.png"
        {...BOUNCING_PRESETS.gentle}
      />

      {/* 右側：energeticプリセット */}
      <BouncingYukkuriCharacter
        left={800}
        bottom={100}
        width={280}
        height={280}
        frame={frame}
        faceImagePath="yukkuri_character/face.png"
        eyeImagePath="yukkuri_character/eyes_open.png"
        mouthImagePath="yukkuri_character/mouth_close.png"
        {...BOUNCING_PRESETS.energetic}
        startFrame={60} // 少し遅れて開始
      />

      {/* 中央：呼吸アニメーション専用 */}
      <BouncingYukkuriCharacter
        left={500}
        bottom={200}
        width={250}
        height={250}
        scale={1.2}
        frame={frame}
        faceImagePath="yukkuri_character/face.png"
        eyeImagePath="yukkuri_character/eyes_half.png"
        mouthImagePath="yukkuri_character/mouth_half.png"
        {...BOUNCING_PRESETS.breathingOnly}
        startFrame={30}
      />

      {/* タイトル */}
      {showTitle && (
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 48,
            fontWeight: 'bold',
            color: '#2C3E50',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(255,255,255,0.8)',
          }}
        >
          {titleText}
        </div>
      )}

      {/* ラベル */}
      {showLabels && (
        <>
          <div
            style={{
              position: 'absolute',
              bottom: 50,
              left: 200,
              fontSize: 20,
              color: '#2C3E50',
              fontWeight: 'bold',
              textAlign: 'center',
              width: 300,
            }}
          >
            Gentle Bounce
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 50,
              left: 500,
              fontSize: 20,
              color: '#2C3E50',
              fontWeight: 'bold',
              textAlign: 'center',
              width: 250,
            }}
          >
            Breathing Only
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 50,
              left: 800,
              fontSize: 20,
              color: '#2C3E50',
              fontWeight: 'bold',
              textAlign: 'center',
              width: 280,
            }}
          >
            Energetic Bounce
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

/**
 * デフォルトprops
 */
export const BouncingExampleDefaultProps = {
  backgroundColor: '#87CEEB',
  showTitle: true,
  showLabels: true,
  titleText: 'バウンス＆呼吸アニメーション',
};