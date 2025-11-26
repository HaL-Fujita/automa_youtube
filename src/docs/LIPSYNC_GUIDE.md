# 口パク＆瞬きアニメーション詳細ガイド

`LipSyncBlinkingYukkuriCharacter`の詳細な使用方法とカスタマイズ方法を説明します。

## 🎯 概要

音声に同期した高精度口パクアニメーションと自然な瞬きアニメーションを組み合わせたテンプレートです。解説動画やナレーション動画に最適です。

## 📝 基本的な使用方法

```tsx
import {
  LipSyncBlinkingYukkuriCharacter,
  createSpeechSegments
} from './components/LipSyncBlinkingYukkuriCharacter';

const speechSegments = createSpeechSegments([
  { startTime: 1.0, endTime: 3.5, text: "こんにちは！" },
  { startTime: 4.0, endTime: 7.2, text: "ゆっくりしていってね！" }
]);

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
/>
```

## 🎛️ プロパティ一覧

### 必須プロパティ

| プロパティ | 型 | 説明 |
|-----------|----|----|
| `left` | `number` | キャラクターの左からの位置（px） |
| `bottom` | `number` | キャラクターの下からの位置（px） |
| `width` | `number` | キャラクターの幅（px） |
| `height` | `number` | キャラクターの高さ（px） |
| `frame` | `number` | 現在のフレーム番号 |
| `faceImagePath` | `string` | 顔画像のパス |
| `eyeImageBasePath` | `string` | 目画像のベースパス |
| `mouthImageBasePath` | `string` | 口画像のベースパス |

### オプションプロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|----|-----------|----|
| `scale` | `number` | `1` | 全体の拡大率 |
| `fps` | `number` | `30` | フレームレート |
| `zIndex` | `number` | `20` | Z-index |
| `speechSegments` | `SpeechSegment[]` | `[]` | 話している区間の配列 |
| `lipSyncSpeed` | `number` | `4` | 口パクの速度（フレーム数） |
| `blinkCycle` | `number` | `150` | 瞬きの周期（フレーム数） |
| `blinkStartFrame` | `number` | `130` | 瞬きの開始フレーム |
| `blinkDuration` | `number` | `15` | 瞬きの継続時間 |
| `breathingEnabled` | `boolean` | `true` | 呼吸アニメーションの有効/無効 |
| `breathingIntensity` | `number` | `1.5` | 呼吸の強度 |
| `breathingSpeed` | `number` | `0.015` | 呼吸の速度 |

## 🗣️ 音声セグメントの設定

### SpeechSegment型

```tsx
interface SpeechSegment {
  start: number;    // 開始フレーム番号
  end: number;      // 終了フレーム番号
  text?: string;    // 字幕テキスト（オプション）
}
```

### セグメント作成ヘルパー

```tsx
// 秒数から自動変換
const segments = createSpeechSegments([
  { startTime: 1.0, endTime: 3.5, text: "最初のセリフ" },
  { startTime: 5.0, endTime: 8.2, text: "2番目のセリフ" }
], 30); // 30fps

// 手動でフレーム指定
const manualSegments: SpeechSegment[] = [
  { start: 30, end: 105, text: "手動指定セリフ" },
  { start: 150, end: 246, text: "次のセリフ" }
];
```

## 👀 画像ファイルの命名規則

### 必要な画像ファイル

```
public/yukkuri_character/
├── face.png           # 顔ベース
├── eyes_open.png       # 目：開いた状態
├── eyes_half.png       # 目：半開きの状態
├── eyes_close.png      # 目：閉じた状態
├── mouth_close.png     # 口：閉じた状態
├── mouth_half.png      # 口：半開きの状態
└── mouth_open.png      # 口：開いた状態
```

### パス指定例

```tsx
<LipSyncBlinkingYukkuriCharacter
  faceImagePath="yukkuri_character/face.png"
  eyeImageBasePath="yukkuri_character/eyes"      // "_open.png"等が自動付加
  mouthImageBasePath="yukkuri_character/mouth"   // "_close.png"等が自動付加
  // ...
/>
```

## 🎨 プリセット設定

### 利用可能なプリセット

```tsx
import { ANIMATION_PRESETS } from './components/LipSyncBlinkingYukkuriCharacter';

// normalプリセットを使用
<LipSyncBlinkingYukkuriCharacter
  {...otherProps}
  {...ANIMATION_PRESETS.normal.blink}
  {...ANIMATION_PRESETS.normal.lipSync}
  {...ANIMATION_PRESETS.normal.breathing}
/>
```

| プリセット | 瞬き周期 | 口パク速度 | 呼吸強度 | 特徴 |
|-----------|----------|-----------|----------|------|
| `calm` | 180フレーム | 5フレーム | 1.0 | 落ち着いた動き |
| `normal` | 150フレーム | 4フレーム | 1.5 | 標準的な動き |
| `energetic` | 120フレーム | 3フレーム | 2.0 | 活発な動き |
| `hyperactive` | 90フレーム | 2フレーム | 2.5 | 超活発な動き |

## 🔧 詳細なカスタマイズ

### 口パクアニメーションの調整

```tsx
// ゆっくりな口パク
lipSyncSpeed={6}

// 高速な口パク
lipSyncSpeed={2}
```

**推奨値:** 2 - 6 フレーム

### 瞬きアニメーションの調整

```tsx
// 頻繁に瞬き
blinkCycle={90}        // 3秒に1回（30fps）
blinkStartFrame={75}   // 周期の80%で開始
blinkDuration={10}     // 短い瞬き

// まれに瞬き
blinkCycle={240}       // 8秒に1回
blinkStartFrame={220}  // 周期の90%で開始
blinkDuration={20}     // 長い瞬き
```

### 呼吸アニメーションの調整

```tsx
// 深い呼吸
breathingIntensity={3.0}
breathingSpeed={0.01}

// 浅い呼吸
breathingIntensity={0.8}
breathingSpeed={0.02}

// 呼吸を無効化
breathingEnabled={false}
```

## 📊 音声分析とセグメント作成

### 手動分析による精密設定

1. **音声波形を確認**
   - Audacityなどの音声編集ソフトで波形を表示
   - 話している部分と無音部分を特定

2. **時間を測定**
   - 各セリフの開始・終了時間を秒単位で記録
   - 効果音やBGMの部分は除外

3. **セグメント作成**
   ```tsx
   const segments = createSpeechSegments([
     { startTime: 2.1, endTime: 5.8, text: "正確なタイミング" },
     { startTime: 7.3, endTime: 12.0, text: "次のセリフ" }
   ]);
   ```

### AI音声認識ツールの活用

WhisperなどのAI音声認識ツールで取得したタイミングデータを変換：

```tsx
// Whisperの出力例を変換
const whisperSegments = [
  { "start": 1.2, "end": 4.5, "text": "音声認識結果" }
];

const speechSegments = whisperSegments.map(segment =>
  createSpeechSegment(segment.start, segment.end, segment.text)
);
```

## 🎬 実用的な使用例

### ナレーション動画

```tsx
export const NarrationVideo: React.FC = () => {
  const frame = useCurrentFrame();

  const speechSegments = createSpeechSegments([
    { startTime: 0.5, endTime: 4.2, text: "今日は○○について解説します" },
    { startTime: 5.0, endTime: 9.8, text: "まず最初のポイントから見ていきましょう" },
    { startTime: 11.0, endTime: 15.5, text: "このように設定することで..." }
  ]);

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/narration.wav')} />

      <LipSyncBlinkingYukkuriCharacter
        left={400}
        bottom={100}
        width={400}
        height={400}
        frame={frame}
        faceImagePath="yukkuri_sakuya/face.png"
        eyeImageBasePath="yukkuri_sakuya/eyes"
        mouthImageBasePath="yukkuri_sakuya/mouth"
        speechSegments={speechSegments}
        {...ANIMATION_PRESETS.normal.blink}
        {...ANIMATION_PRESETS.normal.lipSync}
        {...ANIMATION_PRESETS.normal.breathing}
      />

      {/* 字幕表示機能も組み込み可能 */}
      <SubtitleDisplay speechSegments={speechSegments} frame={frame} />
    </AbsoluteFill>
  );
};
```

### 対話シーン

```tsx
export const DialogueScene: React.FC = () => {
  const frame = useCurrentFrame();

  const sakuyaSegments = createSpeechSegments([
    { startTime: 1.0, endTime: 3.5, text: "こんにちは咲夜です" },
    { startTime: 7.0, endTime: 10.2, text: "今日はいい天気ですね" }
  ]);

  const marisaSegments = createSpeechSegments([
    { startTime: 4.0, endTime: 6.5, text: "やあ魔理沙だぜ" },
    { startTime: 11.0, endTime: 14.0, text: "そうだな、いい天気だ" }
  ]);

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/dialogue.wav')} />

      {/* 咲夜（左側） */}
      <LipSyncBlinkingYukkuriCharacter
        left={200}
        bottom={100}
        width={350}
        height={350}
        frame={frame}
        faceImagePath="yukkuri_sakuya/face.png"
        eyeImageBasePath="yukkuri_sakuya/eyes"
        mouthImageBasePath="yukkuri_sakuya/mouth"
        speechSegments={sakuyaSegments}
        {...ANIMATION_PRESETS.calm.blink}
        {...ANIMATION_PRESETS.calm.lipSync}
      />

      {/* 魔理沙（右側） */}
      <LipSyncBlinkingYukkuriCharacter
        left={700}
        bottom={100}
        width={350}
        height={350}
        frame={frame}
        faceImagePath="yukkuri_marisa/face.png"
        eyeImageBasePath="yukkuri_marisa/eyes"
        mouthImageBasePath="yukkuri_marisa/mouth"
        speechSegments={marisaSegments}
        {...ANIMATION_PRESETS.energetic.blink}
        {...ANIMATION_PRESETS.energetic.lipSync}
      />
    </AbsoluteFill>
  );
};
```

## ⚠️ 注意事項

1. **音声同期の精度**
   - セグメント設定の精度が口パクの自然さに直結
   - 0.1秒単位での調整を推奨

2. **画像品質**
   - 目・口の各状態画像の品質統一が重要
   - 推奨解像度：512x512px以上

3. **パフォーマンス**
   - 長時間動画では大量のセグメントデータに注意
   - 不要なセグメントは削除してパフォーマンス向上

## 🚀 パフォーマンス最適化

### セグメントデータの最適化

```tsx
// 短すぎるセグメントは統合
const optimizedSegments = segments.filter(
  segment => (segment.end - segment.start) >= 15 // 0.5秒以上のみ
);
```

### メモ化の活用

```tsx
const MemoizedLipSync = React.memo(LipSyncBlinkingYukkuriCharacter);

// セグメントデータもメモ化
const memoizedSegments = useMemo(() =>
  createSpeechSegments(rawSegments), [rawSegments]
);
```

## 📖 関連ドキュメント

- [メインREADME](./README.md)
- [バウンスアニメーションガイド](./BOUNCING_GUIDE.md)
- [サンプルコード](../examples/LipSyncExample.tsx)