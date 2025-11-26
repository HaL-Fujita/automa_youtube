# バウンスアニメーション詳細ガイド

`BouncingYukkuriCharacter`の詳細な使用方法とカスタマイズ方法を説明します。

## 🎯 概要

ポヨンポヨン跳ねるゆっくりキャラクターアニメーションテンプレートです。自然なバウンス動作とY軸スケールによるゆっくり特有の動きを再現します。

## 📝 基本的な使用方法

```tsx
import { BouncingYukkuriCharacter } from './components/BouncingYukkuriCharacter';

<BouncingYukkuriCharacter
  left={100}
  bottom={50}
  width={300}
  height={300}
  frame={frame}
  faceImagePath="yukkuri_character/face.png"
  eyeImagePath="yukkuri_character/eyes_open.png"
  mouthImagePath="yukkuri_character/mouth_close.png"
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
| `eyeImagePath` | `string` | 目画像のパス |
| `mouthImagePath` | `string` | 口画像のパス |

### オプションプロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|----|-----------|----|
| `scale` | `number` | `1` | 全体の拡大率 |
| `fps` | `number` | `30` | フレームレート |
| `bounceSpeed` | `number` | `1.6` | バウンス速度 |
| `bounceHeight` | `number` | `20` | バウンスの高さ（px） |
| `scaleIntensity` | `number` | `0.06` | Y軸スケールの強度 |
| `zIndex` | `number` | `20` | Z-index |
| `startFrame` | `number` | `30` | アニメーション開始フレーム |

## 🎨 プリセット設定

### 利用可能なプリセット

```tsx
import { BOUNCING_PRESETS } from './components/BouncingYukkuriCharacter';

// gentleプリセットを使用
<BouncingYukkuriCharacter
  {...otherProps}
  {...BOUNCING_PRESETS.gentle}
/>
```

| プリセット | bounceSpeed | bounceHeight | scaleIntensity | 特徴 |
|-----------|------------|-------------|----------------|------|
| `gentle` | 1.2 | 15 | 0.04 | おだやかな跳ね方 |
| `normal` | 1.6 | 20 | 0.06 | 標準的な跳ね方 |
| `energetic` | 2.2 | 30 | 0.08 | 元気な跳ね方 |
| `hyperactive` | 3.0 | 40 | 0.1 | 超活発な跳ね方 |

## 🔧 詳細なカスタマイズ

### バウンス速度の調整

```tsx
// ゆっくりなバウンス
bounceSpeed={0.8}

// 高速なバウンス
bounceSpeed={3.5}
```

**推奨値:** 0.8 - 3.0

### バウンス高度の調整

```tsx
// 低いバウンス
bounceHeight={10}

// 高いバウンス
bounceHeight={50}
```

**推奨値:** 10 - 50 px

### Y軸スケール強度の調整

```tsx
// 控えめな変形
scaleIntensity={0.02}

// 大きな変形
scaleIntensity={0.15}
```

**推奨値:** 0.02 - 0.1

## 📐 レイアウトのコツ

### 複数キャラクターの配置

```tsx
// 左右に配置
<BouncingYukkuriCharacter left={200} bottom={100} {...props1} />
<BouncingYukkuriCharacter left={800} bottom={100} {...props2} />

// 前後に配置（zIndexで制御）
<BouncingYukkuriCharacter zIndex={10} {...backCharacter} />
<BouncingYukkuriCharacter zIndex={20} {...frontCharacter} />
```

### タイミングをずらす

```tsx
// 最初から開始
<BouncingYukkuriCharacter startFrame={0} {...props} />

// 2秒後に開始（30fps）
<BouncingYukkuriCharacter startFrame={60} {...props} />
```

## 🎬 アニメーションパターン例

### ゆっくりとした呼吸のような動き

```tsx
<BouncingYukkuriCharacter
  bounceSpeed={0.6}
  bounceHeight={8}
  scaleIntensity={0.03}
  {...otherProps}
/>
```

### 元気いっぱいなジャンプ

```tsx
<BouncingYukkuriCharacter
  bounceSpeed={2.8}
  bounceHeight={45}
  scaleIntensity={0.12}
  {...otherProps}
/>
```

### リズミカルなダンス風

```tsx
<BouncingYukkuriCharacter
  bounceSpeed={2.0}
  bounceHeight={25}
  scaleIntensity={0.08}
  {...otherProps}
/>
```

## 🎯 実用的な使用例

### 解説動画でのキャラクター表示

```tsx
export const ExplanationVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {/* メインナレーター */}
      <BouncingYukkuriCharacter
        left={400}
        bottom={100}
        width={350}
        height={350}
        frame={frame}
        faceImagePath="yukkuri_sakuya/face.png"
        eyeImagePath="yukkuri_sakuya/eyes_open.png"
        mouthImagePath="yukkuri_sakuya/mouth_close.png"
        {...BOUNCING_PRESETS.normal}
      />

      {/* サブキャラクター */}
      <BouncingYukkuriCharacter
        left={100}
        bottom={50}
        width={200}
        height={200}
        scale={0.8}
        frame={frame}
        faceImagePath="yukkuri_marisa/face.png"
        eyeImagePath="yukkuri_marisa/eyes_open.png"
        mouthImagePath="yukkuri_marisa/mouth_close.png"
        {...BOUNCING_PRESETS.gentle}
        startFrame={60}
      />
    </AbsoluteFill>
  );
};
```

## ⚠️ 注意事項

1. **パフォーマンス**
   - 同時に表示するキャラクター数が多い場合、パフォーマンスに注意
   - `scaleIntensity`が大きすぎるとちらつきの原因になる場合がある

2. **画像サイズ**
   - 画像はキャラクターサイズに対して適切な解像度を使用
   - 推奨：300x300px 以上

3. **フレームレート**
   - 30fps以外を使用する場合は、`fps`プロパティを正しく設定

## 🚀 パフォーマンス最適化

### 重い計算の削減

```tsx
// 複数キャラクターで同じ設定を使用する場合
const sharedProps = {
  bounceSpeed: 1.6,
  bounceHeight: 20,
  scaleIntensity: 0.06,
};

<BouncingYukkuriCharacter {...baseProps} {...sharedProps} />
<BouncingYukkuriCharacter {...baseProps2} {...sharedProps} />
```

### メモ化の活用

```tsx
const MemoizedBouncing = React.memo(BouncingYukkuriCharacter);
```

## 📖 関連ドキュメント

- [メインREADME](./README.md)
- [口パクアニメーションガイド](./LIPSYNC_GUIDE.md)
- [サンプルコード](../examples/BouncingExample.tsx)