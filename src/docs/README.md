# ゆっくりキャラクターアニメーションテンプレート

**「AI動画編集の教科書」特典テンプレート**

商用利用可能なRemotionベースゆっくりキャラクターアニメーションテンプレート集です。

> 🎁 **この特典について**
> このテンプレート集は「AI動画編集の教科書」教材の購入者様限定特典です。
> 教材と合わせてご活用いただくことで、より効率的な動画制作が可能になります。

## 🎯 概要

このテンプレート集は、Remotion（React-based video creation framework）を使用してゆっくり解説動画やアニメーション動画を作成するための高品質なアニメーションコンポーネントを提供します。

### 📦 含まれるテンプレート

1. **BouncingYukkuriCharacter** - ポヨンポヨン跳ねるアニメーション
2. **LipSyncBlinkingYukkuriCharacter** - 音声同期口パク＆瞬きアニメーション
3. **SantoushinSakuyaCharacter** - 三頭身咲耶キャラクター（感情表現・音素同期対応）

## 🚀 特徴

- ✅ **商用利用可能** - ライセンス制限なし
- ✅ **高性能** - Remotion最適化済み
- ✅ **カスタマイズ性** - 豊富な設定パラメータ
- ✅ **使いやすさ** - プリセット設定と詳細ドキュメント
- ✅ **TypeScript対応** - 完全型安全

## 📋 必要環境

- Node.js 16.0.0 以上
- Remotion 4.0.0 以上
- React 18.0.0 以上
- TypeScript 4.9.0 以上

## 📥 インストール

1. プロジェクトに必要なファイルをコピー：
```bash
# コンポーネントファイルをプロジェクトにコピー
cp -r components/ your-project/src/
cp -r examples/ your-project/src/
```

2. 画像アセットの準備：
```
public/
├── yukkuri_character/
│   ├── face.png          # 顔ベース画像
│   ├── eyes_open.png      # 目（開）
│   ├── eyes_half.png      # 目（半開）
│   ├── eyes_close.png     # 目（閉）
│   ├── mouth_close.png    # 口（閉）
│   ├── mouth_half.png     # 口（半開）
│   └── mouth_open.png     # 口（開）
└── audio/
    └── your_voice.wav     # 音声ファイル（口パク用）
```

## 🎬 基本的な使用方法

### ポヨンポヨン跳ねるアニメーション

```tsx
import { BouncingYukkuriCharacter, BOUNCING_PRESETS } from './components/BouncingYukkuriCharacter';

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <BouncingYukkuriCharacter
        left={100}
        bottom={50}
        width={300}
        height={300}
        frame={frame}
        faceImagePath="yukkuri_character/face.png"
        eyeImagePath="yukkuri_character/eyes_open.png"
        mouthImagePath="yukkuri_character/mouth_close.png"
        {...BOUNCING_PRESETS.normal}
      />
    </AbsoluteFill>
  );
};
```

### 音声同期口パクアニメーション

```tsx
import {
  LipSyncBlinkingYukkuriCharacter,
  createSpeechSegments,
  ANIMATION_PRESETS
} from './components/LipSyncBlinkingYukkuriCharacter';

export const MyLipSyncVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // 音声に合わせてセグメントを定義
  const speechSegments = createSpeechSegments([
    { startTime: 1.0, endTime: 3.5, text: "こんにちは！" },
    { startTime: 4.0, endTime: 7.2, text: "ゆっくりしていってね！" }
  ]);

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/voice.wav')} />
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
    </AbsoluteFill>
  );
};
```

## 🎨 カスタマイズ

### 利用可能なプリセット

**バウンスアニメーション:**
- `gentle` - おだやかな動き
- `normal` - 標準的な動き
- `energetic` - 元気な動き
- `hyperactive` - 超活発な動き

**口パク＆瞬きアニメーション:**
- `calm` - 落ち着いた動き
- `normal` - 標準的な動き
- `energetic` - 活発な動き
- `hyperactive` - 超活発な動き

### パラメータの詳細調整

各コンポーネントは豊富なプロパティで細かくカスタマイズできます。詳細は各コンポーネントのTypeScript型定義をご参照ください。

## 📁 ファイル構成

```
yukkuri-animation-templates/
├── components/
│   ├── BouncingYukkuriCharacter.tsx      # バウンスアニメーション
│   ├── LipSyncBlinkingYukkuriCharacter.tsx # 口パク＆瞬きアニメーション
│   └── SantoushinSakuyaCharacter.tsx     # 三頭身咲耶キャラクター
├── examples/
│   ├── BouncingExample.tsx               # バウンス使用例
│   ├── LipSyncExample.tsx               # 口パク使用例
│   └── SantoushinSakuyaExample.tsx      # 三頭身咲耶使用例
├── docs/
│   ├── README.md                        # このファイル
│   ├── BOUNCING_GUIDE.md               # バウンスアニメーション詳細ガイド
│   └── LIPSYNC_GUIDE.md                # 口パクアニメーション詳細ガイド
└── assets/
    └── sample_images/                   # サンプル画像（参考用）
```

## 🔧 トラブルシューティング

### よくある問題

1. **画像が表示されない**
   - `public/`フォルダに正しく画像を配置しているか確認
   - ファイルパスが正しいか確認

2. **口パクが音声と合わない**
   - `speechSegments`の時間設定を確認
   - 音声ファイルの実際の長さを確認

3. **アニメーションがカクつく**
   - フレームレート設定を確認（推奨：30fps）
   - パフォーマンスプロファイルを確認

## 📄 ライセンス

このテンプレートは商用利用ライセンスの下で提供されています。

### 許可される使用

- ✅ 商用プロジェクトでの使用
- ✅ 動画コンテンツでの収益化
- ✅ 自分のプロジェクト用の修正・改変
- ✅ 派生作品の作成

### 禁止される使用

- ❌ テンプレートの再配布・転売
- ❌ ソースコードの第三者への共有
- ❌ 競合テンプレート商品の作成
- ❌ リバースエンジニアリング

### ライセンス条件

- 購入者のみに使用権が付与されます
- ユーザー/組織ごとに個別ライセンスが必要です
- 詳細は同梱のLICENSEファイルをご確認ください

## 🤝 サポート

テンプレートの使用方法に関する質問やバグ報告は、購入先のサポートチャンネルをご利用ください。

## 🎉 更新履歴

### v1.0.0 (2024年10月)
- 初回リリース
- BouncingYukkuriCharacter追加
- LipSyncBlinkingYukkuriCharacter追加
- プリセット設定追加
- サンプルコード追加

---

**Happy Video Making with Yukkuri Characters! 🎬✨**