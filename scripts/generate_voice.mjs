/**
 * VOICEVOX音声生成スクリプト
 * ずんだもん（ノーマル）で1.3倍速の音声を生成
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VOICEVOX_URL = "http://127.0.0.1:50021";
const SPEAKER_ID = 3;  // ずんだもん（ノーマル）
const SPEED_SCALE = 1.3;  // 1.3倍速
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;  // 1秒

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 台本ファイルを読み込んでセグメントに分割
 */
function readScript(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '');

  // 行ごとに分割
  const lines = content.split(/\r?\n/);
  const segments = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // 空行や記号だけの行はスキップ
    if (!trimmed) continue;
    // 番号だけの行やリストマーカーだけの行はスキップ
    if (/^[\s\*\-\d\.\:：・〜→]+$/.test(trimmed)) continue;
    // 先頭の記号やスペースを除去
    const cleaned = trimmed.replace(/^[\s\*\-・]+/, '').trim();
    if (cleaned) {
      segments.push(cleaned);
    }
  }

  return segments;
}

/**
 * VOICEVOXで音声を生成（リトライ機能付き）
 */
async function generateAudio(text, outputPath, speakerId = SPEAKER_ID, speed = SPEED_SCALE) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // 音声合成用のクエリを作成
      const queryResponse = await fetch(
        `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
        { method: 'POST' }
      );
      if (!queryResponse.ok) {
        throw new Error(`Query failed: ${queryResponse.status}`);
      }
      const query = await queryResponse.json();

      // 速度を設定
      query.speedScale = speed;

      // 音声合成
      const synthesisResponse = await fetch(
        `${VOICEVOX_URL}/synthesis?speaker=${speakerId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(query)
        }
      );
      if (!synthesisResponse.ok) {
        throw new Error(`Synthesis failed: ${synthesisResponse.status}`);
      }

      // ファイルに保存
      const buffer = Buffer.from(await synthesisResponse.arrayBuffer());
      fs.writeFileSync(outputPath, buffer);

      return outputPath;
    } catch (e) {
      lastError = e;
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY);
      }
    }
  }

  throw lastError;
}

async function main() {
  // パス設定
  const projectDir = path.resolve(__dirname, '..');
  const daihonPath = path.join(projectDir, 'src', 'assets', 'daihon.txt');
  const outputDir = path.join(projectDir, 'public', 'audio');

  // 出力ディレクトリ作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 台本読み込み
  console.log(`台本を読み込み中: ${daihonPath}`);
  const segments = readScript(daihonPath);

  console.log(`セグメント数: ${segments.length}`);
  console.log(`話者: ずんだもん（ID: ${SPEAKER_ID}）`);
  console.log(`速度: ${SPEED_SCALE}倍速`);
  console.log('-'.repeat(50));

  // 各セグメントの音声を生成
  const generatedFiles = [];
  for (let i = 0; i < segments.length; i++) {
    const text = segments[i];
    const outputPath = path.join(outputDir, `segment_${String(i).padStart(3, '0')}.wav`);
    console.log(`[${i + 1}/${segments.length}] 生成中...`);
    console.log(`  テキスト: ${text.slice(0, 50)}${text.length > 50 ? '...' : ''}`);

    try {
      await generateAudio(text, outputPath);
      generatedFiles.push(outputPath);
      console.log(`  保存: segment_${String(i).padStart(3, '0')}.wav`);
    } catch (e) {
      console.log(`  エラー: ${e.message}`);
    }
  }

  console.log('-'.repeat(50));
  console.log(`完了！ ${generatedFiles.length}個の音声ファイルを生成しました`);
  console.log(`出力先: ${outputDir}`);

  // セグメント情報をJSONで保存
  const segmentsInfo = segments.map((text, i) => ({
    index: i,
    text: text,
    audio_file: `audio/segment_${String(i).padStart(3, '0')}.wav`
  }));

  const infoPath = path.join(outputDir, 'segments_info.json');
  fs.writeFileSync(infoPath, JSON.stringify(segmentsInfo, null, 2));
  console.log(`セグメント情報: ${infoPath}`);
}

main().catch(console.error);
