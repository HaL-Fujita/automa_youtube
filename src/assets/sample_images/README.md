# サンプル画像について

このフォルダには、テンプレートのテスト用サンプル画像を配置できます。

## 画像仕様

### 推奨フォーマット
- **ファイル形式**: PNG（透明背景推奨）
- **解像度**: 512x512px以上
- **カラープロファイル**: sRGB

### 命名規則

```
yukkuri_character/
├── face.png           # 顔ベース画像
├── eyes_open.png       # 目：開いた状態
├── eyes_half.png       # 目：半開きの状態
├── eyes_close.png      # 目：閉じた状態
├── mouth_close.png     # 口：閉じた状態
├── mouth_half.png      # 口：半開きの状態
└── mouth_open.png      # 口：開いた状態
```

## 使用方法

1. 上記の命名規則に従って画像を作成
2. `public/`フォルダにコピー
3. テンプレートのパスを適切に設定

```tsx
// 使用例
<LipSyncBlinkingYukkuriCharacter
  faceImagePath="yukkuri_character/face.png"
  eyeImageBasePath="yukkuri_character/eyes"
  mouthImageBasePath="yukkuri_character/mouth"
  // ...
/>
```

## 注意事項

- **著作権**: オリジナル画像または適切なライセンスの画像のみ使用
- **品質統一**: 全ての状態画像で解像度・色調を統一
- **透明背景**: 重ね合わせを考慮して透明背景を推奨
- **ファイルサイズ**: 動画のパフォーマンスを考慮して適度に圧縮

## トラブルシューティング

### 画像が表示されない場合
1. ファイルパスが正しいか確認
2. ファイル名が命名規則に一致しているか確認
3. `public/`フォルダに正しく配置されているか確認

### 画像の切り替わりが不自然な場合
1. 全ての状態画像の位置・サイズが統一されているか確認
2. 透明部分の処理が適切か確認
3. 解像度が十分か確認