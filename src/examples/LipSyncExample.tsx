import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import {
  LipSyncBlinkingYukkuriCharacter,
  createSpeechSegments,
  ANIMATION_PRESETS,
  LipSyncBlinkingYukkuriCharacterSchema,
  LipSyncBlinkingYukkuriCharacterDefaultProps
} from '../components/LipSyncBlinkingYukkuriCharacter';
import { z } from 'zod';

/**
 * 音声同期口パクと瞬きアニメーションの使用例
 *
 * この例では：
 * - 音声ファイルに同期した口パクアニメーション
 * - 自然な瞬きアニメーション
 * - 字幕表示機能
 * - 異なるアニメーションプリセットの比較
 */
/**
 * LipSyncExample用zodスキーマ
 */
export const LipSyncExampleSchema = z.object({
  backgroundColor: z.string().describe('Background color (hex or named color)'),
  showTitle: z.boolean().describe('Show title text'),
  showSubtitles: z.boolean().describe('Show subtitles'),
  showPresetLabels: z.boolean().describe('Show preset labels'),
  titleText: z.string().describe('Title text content'),
  audioFile: z.string().describe('Audio file path (relative to public/)'),
});

export interface LipSyncExampleProps {
  backgroundColor?: string;
  showTitle?: boolean;
  showSubtitles?: boolean;
  showPresetLabels?: boolean;
  titleText?: string;
  audioFile?: string;
}

export const LipSyncExample: React.FC<LipSyncExampleProps> = ({
  backgroundColor = '#F0F8FF',
  showTitle = true,
  showSubtitles = true,
  showPresetLabels = true,
  titleText = '音声同期口パク＆瞬きアニメーション',
  audioFile = 'audio/sample_voice.wav',
}) => {
  const frame = useCurrentFrame();
  // 音声セグメントの定義（実際の音声に合わせて調整してください）
  const speechSegments = createSpeechSegments([
    { startTime: 1.0, endTime: 3.5, text: "こんにちは！ゆっくりです。" },
    { startTime: 4.0, endTime: 7.2, text: "今日は素敵な一日ですね。" },
    { startTime: 8.0, endTime: 12.0, text: "このテンプレートを使って動画を作ってみてください！" },
    { startTime: 13.0, endTime: 15.5, text: "ゆっくりしていってね！" }
  ], 30);

  // 現在表示する字幕を取得
  const getCurrentSubtitle = (): string => {
    const currentSegment = speechSegments.find(
      segment => frame >= segment.start && frame < segment.end
    );
    return currentSegment?.text || '';
  };

  const currentSubtitle = getCurrentSubtitle();

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* 音声ファイル（実際のファイルパスに変更してください） */}
      <Audio src={staticFile(audioFile)} />

      {/* メインキャラクター（normalプリセット） */}
      <LipSyncBlinkingYukkuriCharacter
        left={400}
        bottom={150}
        width={400}
        height={400}
        frame={frame}
        faceImagePath="yukkuri_character/face.png"
        eyeImageBasePath="yukkuri_character/eyes"
        mouthImageBasePath="yukkuri_character/mouth"
        speechSegments={speechSegments}
        {...ANIMATION_PRESETS.normal.blink}
        {...ANIMATION_PRESETS.normal.lipSync}
        {...ANIMATION_PRESETS.normal.breathing}
      />

      {/* 左側のキャラクター（calmプリセット） */}
      <LipSyncBlinkingYukkuriCharacter
        left={50}
        bottom={100}
        width={280}
        height={280}
        scale={0.8}
        frame={frame}
        faceImagePath="yukkuri_character/face.png"
        eyeImageBasePath="yukkuri_character/eyes"
        mouthImageBasePath="yukkuri_character/mouth"
        speechSegments={speechSegments}
        {...ANIMATION_PRESETS.calm.blink}
        {...ANIMATION_PRESETS.calm.lipSync}
        {...ANIMATION_PRESETS.calm.breathing}
      />

      {/* 右側のキャラクター（energeticプリセット） */}
      <LipSyncBlinkingYukkuriCharacter
        left={1000}
        bottom={120}
        width={300}
        height={300}
        scale={0.9}
        frame={frame}
        faceImagePath="yukkuri_character/face.png"
        eyeImageBasePath="yukkuri_character/eyes"
        mouthImageBasePath="yukkuri_character/mouth"
        speechSegments={speechSegments}
        {...ANIMATION_PRESETS.energetic.blink}
        {...ANIMATION_PRESETS.energetic.lipSync}
        {...ANIMATION_PRESETS.energetic.breathing}
      />

      {/* タイトル */}
      {showTitle && (
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 42,
            fontWeight: 'bold',
            color: '#2C3E50',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(255,255,255,0.8)',
          }}
        >
          {titleText}
        </div>
      )}

      {/* 字幕表示 */}
      {showSubtitles && currentSubtitle && (
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: '5%',
            right: '5%',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              padding: '15px 30px',
              borderRadius: 12,
              maxWidth: '80%',
            }}
          >
            <p
              style={{
                fontSize: 28,
                lineHeight: 1.4,
                color: '#ffffff',
                margin: 0,
                fontWeight: 500,
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              }}
            >
              {currentSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* 設定情報表示 */}
      {showPresetLabels && (
        <div
          style={{
            position: 'absolute',
            top: 120,
            left: 20,
            fontSize: 18,
            color: '#34495E',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '10px 15px',
            borderRadius: 8,
            fontFamily: 'monospace',
          }}
        >
          左: Calm<br />
          中央: Normal<br />
          右: Energetic
        </div>
      )}
    </AbsoluteFill>
  );
};

/**
 * デフォルトprops
 */
export const LipSyncExampleDefaultProps = {
  backgroundColor: '#F0F8FF',
  showTitle: true,
  showSubtitles: true,
  showPresetLabels: true,
  titleText: '音声同期口パク＆瞬きアニメーション',
  audioFile: 'audio/sample_voice.wav',
};