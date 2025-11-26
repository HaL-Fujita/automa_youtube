import React from 'react';
import { interpolate, useCurrentFrame, Easing } from 'remotion';

/**
 * テロップコンポーネント
 * - 標準テロップ: 白文字、赤アウトライン
 * - 強調テロップ: 黄色文字、赤アウトライン、Z軸アニメーション
 * - 1行ずつ表示（形態素解析で事前分割済み）
 */

// 強調すべきキーワード（テーマ: Remotion + Claude Code 動画編集）
const EMPHASIS_KEYWORDS = [
  // ツール名
  'Remotion', 'remotion', 'Claude Code', 'claude code', 'Claude', 'claude',
  'React', 'react', 'Node.js', 'node.js', 'VS Code', 'npm',
  'VOICEVOX', 'AI', 'プログラミング',
  // 動画編集関連
  '動画', '動画編集', '動画生成', 'タイムライン', 'コンポーネント',
  'テンプレ', 'テンプレート', '量産', 'プレビュー',
  // 特徴・メリット
  '簡単', 'かんたん', '大量生産', 'コピペ', '初心者',
  '無料', 'お金', '月数百円',
  // アクション
  '作成', '導入', 'インストール', '生成', '作る',
  // 感情・印象
  'すごい', 'おすすめ', '大丈夫', 'OK', '勝ち',
  // その他重要語
  'ゴール', 'メニュー', 'ポイント', 'フロー', '全体像',
  'エラー', 'コード', 'ファイル', 'プロジェクト',
  'おうとまくん', '生成AI', 'ロボット',
];

// テキストを強調部分と通常部分に分割
interface TextPart {
  text: string;
  isEmphasis: boolean;
}

function parseTextWithEmphasis(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let foundKeyword: string | null = null;
    let foundIndex = -1;

    // 最も早く出現するキーワードを探す
    for (const keyword of EMPHASIS_KEYWORDS) {
      const index = remaining.indexOf(keyword);
      if (index !== -1 && (foundIndex === -1 || index < foundIndex)) {
        foundIndex = index;
        foundKeyword = keyword;
      }
    }

    if (foundKeyword !== null && foundIndex !== -1) {
      // キーワード前の通常テキスト
      if (foundIndex > 0) {
        parts.push({ text: remaining.slice(0, foundIndex), isEmphasis: false });
      }
      // キーワード（強調）
      parts.push({ text: foundKeyword, isEmphasis: true });
      remaining = remaining.slice(foundIndex + foundKeyword.length);
    } else {
      // 残り全て通常テキスト
      parts.push({ text: remaining, isEmphasis: false });
      break;
    }
  }

  return parts;
}

// 標準テキストスタイル
const standardStyle: React.CSSProperties = {
  fontSize: 72,
  color: '#FFFFFF',
  fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
  fontWeight: 700,
  WebkitTextStroke: '5px #DE4347',
  paintOrder: 'stroke fill',
  lineHeight: 1.4,
};

// 強調テキストスタイル
const emphasisStyle: React.CSSProperties = {
  fontSize: 78,
  color: '#FFFF00',
  fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
  fontWeight: 900,
  WebkitTextStroke: '8px #DE4347',
  paintOrder: 'stroke fill',
  lineHeight: 1.4,
};

interface TelopProps {
  text: string;
  durationFrames: number;
}

// 強調テキストコンポーネント（Z軸アニメーション付き）
const EmphasisText: React.FC<{ text: string; delay?: number }> = ({
  text,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - delay;

  // アニメーション: 0.5秒（15フレーム）かけて奥から手前へ
  const animationDuration = 15;

  const scale = interpolate(
    relativeFrame,
    [0, animationDuration],
    [0.7, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    }
  );

  const translateZ = interpolate(
    relativeFrame,
    [0, animationDuration],
    [-100, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    }
  );

  const opacity = interpolate(
    relativeFrame,
    [0, 5],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <span
      style={{
        ...emphasisStyle,
        display: 'inline-block',
        transform: `scale(${scale}) translateZ(${translateZ}px)`,
        opacity,
        transformStyle: 'preserve-3d',
      }}
    >
      {text}
    </span>
  );
};

// 標準テキストコンポーネント
const StandardText: React.FC<{ text: string }> = ({ text }) => {
  return <span style={standardStyle}>{text}</span>;
};

// メインのテロップコンポーネント（1行表示）
export const Telop: React.FC<TelopProps> = ({ text, durationFrames }) => {
  const frame = useCurrentFrame();

  // フェードイン/アウト
  const fadeInDuration = 6;
  const fadeOutDuration = 6;

  const opacity = interpolate(
    frame,
    [0, fadeInDuration, durationFrames - fadeOutDuration, durationFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // 下からスライドイン
  const translateY = interpolate(
    frame,
    [0, fadeInDuration],
    [15, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    }
  );

  // テキストを強調部分と通常部分に分割
  const parts = parseTextWithEmphasis(text);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 60,
        left: '50%',
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        textAlign: 'center',
        zIndex: 100,
        perspective: 1000,
        maxWidth: '95%',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '14px 28px',
          borderRadius: 10,
          display: 'inline-block',
          whiteSpace: 'nowrap',
        }}
      >
        {parts.map((part, partIndex) =>
          part.isEmphasis ? (
            <EmphasisText
              key={partIndex}
              text={part.text}
              delay={partIndex * 2}
            />
          ) : (
            <StandardText key={partIndex} text={part.text} />
          )
        )}
      </div>
    </div>
  );
};

export default Telop;
