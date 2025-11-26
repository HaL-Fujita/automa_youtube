/**
 * 指定したセグメントを削除してフレーム位置を再計算するスクリプト
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEGMENTS_PATH = path.join(__dirname, '../public/audio/segments_with_telop.json');
const SEGMENT_TO_REMOVE = 57; // 削除するセグメントのindex

// JSONを読み込み
const segments = JSON.parse(fs.readFileSync(SEGMENTS_PATH, 'utf-8'));

// 削除するセグメントを見つける
const removeIndex = segments.findIndex(seg => seg.index === SEGMENT_TO_REMOVE);
if (removeIndex === -1) {
  console.error(`セグメント ${SEGMENT_TO_REMOVE} が見つかりません`);
  process.exit(1);
}

const removedSegment = segments[removeIndex];
const framesToShift = removedSegment.duration_frames + 10; // duration + 10フレームのギャップ

console.log(`削除するセグメント: ${removedSegment.index}`);
console.log(`テキスト: "${removedSegment.text}"`);
console.log(`フレーム: ${removedSegment.start_frame} - ${removedSegment.end_frame}`);
console.log(`シフトするフレーム数: ${framesToShift}`);

// セグメントを削除
segments.splice(removeIndex, 1);

// 後続のセグメントのフレーム位置を調整し、indexを振り直す
for (let i = 0; i < segments.length; i++) {
  // indexを振り直す
  segments[i].index = i;

  // 削除したセグメント以降のフレーム位置を調整
  if (i >= removeIndex) {
    segments[i].start_frame -= framesToShift;
    segments[i].end_frame -= framesToShift;
  }
}

// 保存
fs.writeFileSync(SEGMENTS_PATH, JSON.stringify(segments, null, 2), 'utf-8');

console.log(`\n完了: セグメント ${SEGMENT_TO_REMOVE} を削除しました`);
console.log(`残りのセグメント数: ${segments.length}`);
