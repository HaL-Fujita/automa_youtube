# 三頭身咲耶キャラクター アニメーションガイド

## 📖 概要

`SantoushinSakuyaCharacter`は、三頭身デフォルメされた咲耶キャラクターの高機能アニメーションテンプレートです。感情表現、音素ベースの口パク同期、自然な瞬きなど、プロフェッショナルな動画制作に必要な機能を網羅しています。

## 🎨 主要機能

### 1. 感情状態の切り替え
- **normal（通常）**: 落ち着いた表情
- **surprise（驚き）**: 驚いた表情

各感情状態に対応した画像セットが自動的に適用されます。

### 2. 口パク同期（2つの方式）

#### レガシー方式（フレーム指定）
```tsx
const talkingFrames = [30, 32, 34, 36, 38, 40];
<SantoushinSakuyaCharacter
  talkingFrames={talkingFrames}
  // ...
/>
```

#### 音素ベース方式（VOICEVOX対応）
```tsx
const phonemeTimings: PhonemeTimingInfo[] = [
  { start: 0.0, end: 0.1, phoneme: 'k' },
  { start: 0.1, end: 0.2, phoneme: 'o' },
  // ...
];

<SantoushinSakuyaCharacter
  phonemeTimings={phonemeTimings}
  audioStartFrame={30}
  // ...
/>
```

### 3. 自然な瞬きアニメーション
- 間隔と長さのカスタマイズ可能
- ランダム性の調整で自然な動きを実現

### 4. プリセット設定

```tsx
import { SANTOUSHIN_PRESETS } from './SantoushinSakuyaCharacter';

// 落ち着いた動き
<SantoushinSakuyaCharacter {...SANTOUSHIN_PRESETS.calm} />

// 標準的な動き
<SantoushinSakuyaCharacter {...SANTOUSHIN_PRESETS.normal} />

// 活発な動き
<SantoushinSakuyaCharacter {...SANTOUSHIN_PRESETS.energetic} />

// 驚きの動き
<SantoushinSakuyaCharacter {...SANTOUSHIN_PRESETS.surprise} />
```

## 🚀 使用方法

### 基本的な使用例

```tsx
import { SantoushinSakuyaCharacter } from './components/SantoushinSakuyaCharacter';
import { useCurrentFrame } from 'remotion';

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <SantoushinSakuyaCharacter
        emotion="normal"
        frame={frame}
        left={400}
        bottom={100}
        width={500}
        height={500}
        scale={1}
        blinkInterval={90}
        blinkDuration={3}
      />
    </AbsoluteFill>
  );
};
```

### VOICEVOXとの連携例

```tsx
import { convertVoicevoxToPhonemeTimings } from './components/SantoushinSakuyaCharacter';

// VOICEVOXから取得した音素データ
const voicevoxData = {
  phonemes: [
    { phoneme: 'k', length: 0.1 },
    { phoneme: 'o', length: 0.1 },
    { phoneme: 'n', length: 0.1 },
    // ...
  ]
};

// 音素タイミングに変換
const phonemeTimings = convertVoicevoxToPhonemeTimings(voicevoxData);

<SantoushinSakuyaCharacter
  phonemeTimings={phonemeTimings}
  audioStartFrame={30}
  // ...
/>
```

## 🎛️ プロパティ詳細

### 位置・サイズ関連

| プロパティ | 型 | デフォルト | 説明 |
|-----------|-----|------------|------|
| `left` | number | 50 | 左からの位置（px） |
| `bottom` | number | 50 | 下からの位置（px） |
| `width` | number | 400 | 幅（px） |
| `height` | number | 400 | 高さ（px） |
| `scale` | number | 1 | 拡大率 |
| `zIndex` | number | 10 | Z-index |

### アニメーション関連

| プロパティ | 型 | デフォルト | 説明 |
|-----------|-----|------------|------|
| `emotion` | 'normal' \| 'surprise' | 'normal' | 感情状態 |
| `frame` | number | 必須 | 現在のフレーム番号 |
| `fps` | number | 30 | フレームレート |

### 口パク制御

| プロパティ | 型 | デフォルト | 説明 |
|-----------|-----|------------|------|
| `talkingFrames` | number[] | [] | 口が開くフレーム（レガシー） |
| `phonemeTimings` | PhonemeTimingInfo[] | undefined | 音素タイミング情報 |
| `audioStartFrame` | number | 0 | 音声開始フレーム |
| `lipSyncIntensity` | number | 1 | 口パク強度（0-1） |

### 瞬き制御

| プロパティ | 型 | デフォルト | 説明 |
|-----------|-----|------------|------|
| `blinkEnabled` | boolean | true | 瞬きの有効/無効 |
| `blinkInterval` | number | 90 | 瞬き間隔（フレーム） |
| `blinkDuration` | number | 3 | 瞬きの長さ（フレーム） |
| `blinkRandomness` | number | 0.2 | ランダム性（0-1） |

### 画像パス設定

| プロパティ | 型 | デフォルト | 説明 |
|-----------|-----|------------|------|
| `bodyImageBasePath` | string | 'santoushin_sakuya/sakuya' | ボディ画像のベースパス |
| `eyeImageBasePath` | string | 'santoushin_sakuya/sakuya' | 目画像のベースパス |
| `mouthImageBasePath` | string | 'santoushin_sakuya/sakuya' | 口画像のベースパス |

## 📁 必要な画像ファイル

以下の画像ファイルをpublicフォルダに配置してください：

```
public/
└── santoushin_sakuya/
    ├── sakuya-normal-body.png      # 通常ボディ
    ├── sakuya-normal-eye-open.png  # 通常目開き
    ├── sakuya-normal-eye-close.png # 通常目閉じ
    ├── sakuya-normal-mouth-open.png  # 通常口開き
    ├── sakuya-normal-mouth-close.png # 通常口閉じ
    ├── sakuya-surprise-body.png      # 驚きボディ
    ├── sakuya-surprise-eye-open.png  # 驚き目開き
    ├── sakuya-surprise-eye-close.png # 驚き目閉じ
    ├── sakuya-surprise-mouth-open.png  # 驚き口開き
    └── sakuya-surprise-mouth-close.png # 驚き口閉じ
```

## 🎯 プリセット設定詳細

### calm（落ち着いた）
- 瞬き間隔: 120フレーム（4秒）
- 瞬き時間: 4フレーム
- ランダム性: 0.3
- 口パク強度: 0.8

### normal（標準）
- 瞬き間隔: 90フレーム（3秒）
- 瞬き時間: 3フレーム
- ランダム性: 0.2
- 口パク強度: 1.0

### energetic（活発）
- 瞬き間隔: 60フレーム（2秒）
- 瞬き時間: 2フレーム
- ランダム性: 0.4
- 口パク強度: 1.0

### surprise（驚き）
- 瞬き間隔: 150フレーム（5秒）
- 瞬き時間: 5フレーム
- ランダム性: 0.1
- 口パク強度: 1.0

## 💡 応用例

### 感情の動的切り替え

```tsx
const emotion = frame < 150 ? 'normal' : 'surprise';

<SantoushinSakuyaCharacter
  emotion={emotion}
  frame={frame}
  // ...
/>
```

### 複数キャラクターの配置

```tsx
<>
  {/* メインキャラクター */}
  <SantoushinSakuyaCharacter
    left={200}
    bottom={100}
    scale={1.2}
    {...SANTOUSHIN_PRESETS.normal}
  />

  {/* サブキャラクター */}
  <SantoushinSakuyaCharacter
    left={800}
    bottom={80}
    scale={0.8}
    emotion="surprise"
    {...SANTOUSHIN_PRESETS.calm}
  />
</>
```

### カスタムアニメーション曲線

```tsx
// イージング関数を使った滑らかな動き
const easeInOut = (t: number) => t < 0.5
  ? 2 * t * t
  : -1 + (4 - 2 * t) * t;

const progress = easeInOut(frame / totalFrames);
const scale = 0.8 + progress * 0.4;

<SantoushinSakuyaCharacter
  scale={scale}
  // ...
/>
```

## 🔧 トラブルシューティング

### 画像が表示されない
1. publicフォルダに画像が正しく配置されているか確認
2. ファイル名が指定された命名規則と一致しているか確認
3. 画像パスのプロパティが正しく設定されているか確認

### 口パクがずれる
1. `audioStartFrame`が音声の実際の開始タイミングと一致しているか確認
2. 音素タイミングの時間単位が秒であることを確認
3. フレームレート（fps）の設定が正しいか確認

### 瞬きが不自然
1. `blinkInterval`と`blinkDuration`のバランスを調整
2. `blinkRandomness`の値を調整して自然なランダム性を追加
3. フレームレートに対して適切な値を設定しているか確認

## 📚 関連ドキュメント

- [README.md](./README.md) - プロジェクト全体の概要
- [BOUNCING_GUIDE.md](./BOUNCING_GUIDE.md) - バウンスアニメーションガイド
- [LIPSYNC_GUIDE.md](./LIPSYNC_GUIDE.md) - 口パクアニメーションガイド

---

**三頭身咲耶で素敵な動画制作を！ 🎬✨**