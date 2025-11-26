import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, Sequence } from 'remotion';
import {
  SantoushinSakuyaCharacter,
  SANTOUSHIN_PRESETS,
  generateTalkingFrames,
  PhonemeTimingInfo,
} from '../components/SantoushinSakuyaCharacter';

/**
 * 三頭身咲耶キャラクター 使用例
 *
 * このサンプルでは以下の機能をデモンストレーションします:
 * - 感情状態の切り替え（通常→驚き）
 * - 口パクアニメーション（レガシー方式と音素ベース方式）
 * - 自然な瞬きアニメーション
 * - プリセット設定の使用
 */

// サンプル音素データ（VOICEVOX風）
const samplePhonemeTimings: PhonemeTimingInfo[] = [
  { start: 0.0, end: 0.1, phoneme: 'k' },
  { start: 0.1, end: 0.2, phoneme: 'o' },
  { start: 0.2, end: 0.3, phoneme: 'n' },
  { start: 0.3, end: 0.4, phoneme: 'n' },
  { start: 0.4, end: 0.5, phoneme: 'i' },
  { start: 0.5, end: 0.6, phoneme: 'ch' },
  { start: 0.6, end: 0.7, phoneme: 'i' },
  { start: 0.7, end: 0.8, phoneme: 'w' },
  { start: 0.8, end: 0.9, phoneme: 'a' },
  // "こんにちは"
  { start: 1.2, end: 1.3, phoneme: 'g' },
  { start: 1.3, end: 1.4, phoneme: 'o' },
  { start: 1.4, end: 1.5, phoneme: 'k' },
  { start: 1.5, end: 1.6, phoneme: 'i' },
  { start: 1.6, end: 1.7, phoneme: 'g' },
  { start: 1.7, end: 1.8, phoneme: 'e' },
  { start: 1.8, end: 1.9, phoneme: 'n' },
  { start: 1.9, end: 2.0, phoneme: 'y' },
  { start: 2.0, end: 2.1, phoneme: 'o' },
  // "ご機嫌よう"
];

export const SantoushinSakuyaExample: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#faf0e6' }}>
      {/* BGM（必要に応じて） */}
      {/* <Audio src={staticFile('audio/bgm.mp3')} volume={0.3} /> */}

      {/* タイトル */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 42,
          fontWeight: 'bold',
          color: '#2c3e50',
          fontFamily: 'sans-serif',
        }}
      >
        三頭身咲耶キャラクター デモンストレーション
      </div>

      {/* 説明テキスト */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 50,
          right: 50,
          fontSize: 20,
          color: '#555',
          lineHeight: 1.6,
          fontFamily: 'sans-serif',
        }}
      >
        <p>0-180フレーム: 通常状態（落ち着いた口パクと瞬き）</p>
        <p>180-360フレーム: 驚き状態（活発な口パクと瞬き）</p>
        <p>360-540フレーム: 音素ベースの精密な口パク同期デモ</p>
      </div>

      {/* Sequence 1: 通常状態でのレガシー口パク */}
      <Sequence from={0} durationInFrames={180}>
        <SantoushinSakuyaCharacterNormal />
      </Sequence>

      {/* Sequence 2: 驚き状態でのレガシー口パク */}
      <Sequence from={180} durationInFrames={180}>
        <SantoushinSakuyaCharacterSurprise />
      </Sequence>

      {/* Sequence 3: 音素ベースの口パク */}
      <Sequence from={360} durationInFrames={180}>
        <SantoushinSakuyaCharacterPhoneme />
      </Sequence>

      {/* 状態インジケーター */}
      <StatusIndicator frame={frame} />
    </AbsoluteFill>
  );
};

// 通常状態のキャラクター
const SantoushinSakuyaCharacterNormal: React.FC = () => {
  // レガシー方式の口パクフレーム生成
  const talkingFrames = generateTalkingFrames(30, 150, 4);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 50,
          fontSize: 24,
          color: '#3498db',
          fontWeight: 'bold',
        }}
      >
        感情: 通常（calm preset）
      </div>

      <SantoushinSakuyaCharacter
        emotion="normal"
        talkingFrames={talkingFrames}
        left={600}
        bottom={100}
        width={500}
        height={500}
        scale={1}
        frame={useCurrentFrame()}
        {...SANTOUSHIN_PRESETS.calm}
      />
    </>
  );
};

// 驚き状態のキャラクター
const SantoushinSakuyaCharacterSurprise: React.FC = () => {
  const localFrame = useCurrentFrame();
  // アクティブな口パク
  const talkingFrames = generateTalkingFrames(20, 140, 3);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 50,
          fontSize: 24,
          color: '#e74c3c',
          fontWeight: 'bold',
        }}
      >
        感情: 驚き（energetic preset）
      </div>

      <SantoushinSakuyaCharacter
        emotion="surprise"
        talkingFrames={talkingFrames.map(f => f + 180)} // Sequenceのオフセット調整
        left={600}
        bottom={100}
        width={500}
        height={500}
        scale={1.1}
        frame={localFrame + 180} // Sequenceのオフセット調整
        {...SANTOUSHIN_PRESETS.energetic}
      />
    </>
  );
};

// 音素ベースの口パクデモ
const SantoushinSakuyaCharacterPhoneme: React.FC = () => {
  const localFrame = useCurrentFrame();

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 50,
          fontSize: 24,
          color: '#27ae60',
          fontWeight: 'bold',
        }}
      >
        音素ベース口パク同期（VOICEVOX対応）
      </div>

      <div
        style={{
          position: 'absolute',
          top: 240,
          left: 50,
          fontSize: 18,
          color: '#666',
          fontStyle: 'italic',
        }}
      >
        "こんにちは、ご機嫌よう"
      </div>

      {/* 音声ファイル（実際の使用時はVOICEVOX生成音声を使用） */}
      {/* <Audio src={staticFile('audio/sakuya_greeting.wav')} /> */}

      <SantoushinSakuyaCharacter
        emotion="normal"
        phonemeTimings={samplePhonemeTimings}
        audioStartFrame={360} // このSequenceの開始フレーム
        left={600}
        bottom={100}
        width={500}
        height={500}
        scale={1}
        frame={localFrame + 360} // Sequenceのオフセット調整
        {...SANTOUSHIN_PRESETS.normal}
      />
    </>
  );
};

// 状態インジケーター
const StatusIndicator: React.FC<{ frame: number }> = ({ frame }) => {
  const getStatus = () => {
    if (frame < 180) return { text: 'レガシー口パク（通常）', color: '#3498db' };
    if (frame < 360) return { text: 'レガシー口パク（驚き）', color: '#e74c3c' };
    return { text: '音素ベース口パク', color: '#27ae60' };
  };

  const status = getStatus();

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: status.color,
          color: 'white',
          borderRadius: 20,
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        {status.text} | フレーム: {frame}/540
      </div>
    </div>
  );
};

// デフォルトプロパティのエクスポート（Remotion Studio用）
export const santoushinSakuyaExampleDefaultProps = {
  // プロパティがあればここに記述
};