/**
 * 音声ファイルの長さを取得してsegments_info.jsonを更新
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectDir = path.resolve(__dirname, '..');
const audioDir = path.join(projectDir, 'public', 'audio');
const segmentsPath = path.join(audioDir, 'segments_info.json');

// WAVファイルの長さを取得（秒）
function getWavDuration(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    // WAVヘッダーからサンプルレートとデータサイズを取得
    const sampleRate = buffer.readUInt32LE(24);
    const byteRate = buffer.readUInt32LE(28);
    const dataSize = buffer.readUInt32LE(40);
    return dataSize / byteRate;
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message);
    return 0;
  }
}

// メイン処理
const segments = JSON.parse(fs.readFileSync(segmentsPath, 'utf-8'));
const fps = 30;

let currentFrame = 0;
const updatedSegments = segments.map((segment, index) => {
  const audioPath = path.join(projectDir, 'public', segment.audio_file);
  const duration = getWavDuration(audioPath);
  const durationFrames = Math.ceil(duration * fps);

  const startFrame = currentFrame;
  const endFrame = currentFrame + durationFrames;

  // 次のセグメントのために少し間を空ける（10フレーム = 約0.33秒）
  currentFrame = endFrame + 10;

  return {
    ...segment,
    duration_seconds: duration,
    start_frame: startFrame,
    end_frame: endFrame,
    duration_frames: durationFrames
  };
});

// 更新したデータを保存
fs.writeFileSync(segmentsPath, JSON.stringify(updatedSegments, null, 2));

console.log('セグメント情報を更新しました');
console.log(`総フレーム数: ${currentFrame}`);
console.log(`総再生時間: ${(currentFrame / fps).toFixed(1)}秒`);
