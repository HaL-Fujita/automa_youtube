/**
 * 形態素解析でテロップを10文字以内に分割するスクリプト
 * kuromojiを使用して自然な位置で分割
 */

import kuromoji from 'kuromoji';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEGMENTS_PATH = path.join(__dirname, '../public/audio/segments_info.json');
const OUTPUT_PATH = path.join(__dirname, '../public/audio/segments_with_telop.json');
const MAX_CHARS = 10;

// 行頭に来るべきでない品詞
const NON_START_POS = ['助詞', '助動詞'];

// 行頭に来るべきでない記号パターン（記号で始まるもの全般）
const NON_START_CHARS = /^[、。！？」』）】〉》"'.,!?\])>！？って]+/;

// kuromojiの辞書パス
const DICT_PATH = path.join(__dirname, '../node_modules/kuromoji/dict');

// 分割してはいけない固有名詞（キャラクター名など）
const PROTECTED_WORDS = [
  'おうとまくん',
  'Claude Code',
  'claude code',
  'Remotion',
  'remotion',
  'VOICEVOX',
  'Node.js',
  'VS Code',
];

function initTokenizer() {
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: DICT_PATH }).build((err, tokenizer) => {
      if (err) reject(err);
      else resolve(tokenizer);
    });
  });
}

/**
 * 保護ワードが行をまたいで分割されていたら結合する
 */
function mergeProtectedWords(lines) {
  // すべての行を連結して、保護ワードを含むかチェック
  const fullText = lines.join('');

  for (const word of PROTECTED_WORDS) {
    if (!fullText.includes(word)) continue;

    // 保護ワードが含まれている場合、行をまたいでいるかチェック
    let accumulated = '';
    const newLines = [];

    for (let i = 0; i < lines.length; i++) {
      accumulated += lines[i];

      // 保護ワードが完全に含まれるまで結合を続ける
      let foundComplete = false;
      for (const pw of PROTECTED_WORDS) {
        if (accumulated.includes(pw)) {
          foundComplete = true;
        }
      }

      // 次の行と結合すると保護ワードが完成するかチェック
      let needsMerge = false;
      if (i < lines.length - 1) {
        const nextAccum = accumulated + lines[i + 1];
        for (const pw of PROTECTED_WORDS) {
          // 現在は不完全だが、次を足すと完成する
          if (!accumulated.includes(pw) && nextAccum.includes(pw)) {
            needsMerge = true;
            break;
          }
          // 保護ワードの一部が行末にある
          for (let j = 1; j < pw.length; j++) {
            const prefix = pw.substring(0, j);
            if (accumulated.endsWith(prefix) && lines[i + 1].startsWith(pw.substring(j))) {
              needsMerge = true;
              break;
            }
          }
        }
      }

      if (!needsMerge) {
        newLines.push(accumulated);
        accumulated = '';
      }
    }

    if (accumulated) {
      newLines.push(accumulated);
    }

    // 変更があった場合は再帰的に処理
    if (newLines.length !== lines.length) {
      return mergeProtectedWords(newLines);
    }
  }

  return lines;
}

/**
 * 形態素解析を使って10文字以内に分割（改良版）
 * 保護ワードは分割後に結合処理
 */
function splitTextWithMorphology(tokenizer, text, maxChars = MAX_CHARS) {
  if (text.length <= maxChars) {
    return [text];
  }

  const tokens = tokenizer.tokenize(text);
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const word = token.surface_form;
    const pos = token.pos;

    // 現在の行に追加した場合の長さ
    const newLength = currentLine.length + word.length;

    if (newLength <= maxChars) {
      currentLine += word;
    } else {
      // 収まらない場合
      if (currentLine.length > 0) {
        // 助詞・助動詞・記号は現在行に含める（少し超えてもOK）
        const isNonStart = NON_START_POS.includes(pos) || NON_START_CHARS.test(word);
        if (isNonStart && currentLine.length + word.length <= maxChars + 3) {
          currentLine += word;
          lines.push(currentLine);
          currentLine = '';
          continue;
        }
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // 保護ワードが分割されていたら結合
  let mergedLines = mergeProtectedWords(lines);

  // 短すぎる行や記号で始まる行を結合
  let tempLines = [];
  for (let i = 0; i < mergedLines.length; i++) {
    const line = mergedLines[i];

    // 記号で始まる行は前に結合
    if (NON_START_CHARS.test(line) && tempLines.length > 0) {
      const lastLine = tempLines[tempLines.length - 1];
      if (lastLine.length + line.length <= maxChars + 8) {
        tempLines[tempLines.length - 1] = lastLine + line;
        continue;
      }
    }

    // 短い行（6文字未満）は前に結合
    if (line.length < 6 && tempLines.length > 0) {
      const lastLine = tempLines[tempLines.length - 1];
      if (lastLine.length + line.length <= maxChars + 6) {
        tempLines[tempLines.length - 1] = lastLine + line;
        continue;
      }
    }
    tempLines.push(line);
  }
  mergedLines = tempLines;

  // 複数回マージを繰り返す（短い行がまだ残っている場合）
  let changed = true;
  while (changed) {
    changed = false;
    const newMerged = [];
    for (let i = 0; i < mergedLines.length; i++) {
      const line = mergedLines[i];

      // 記号で始まるか7文字未満の行は前に結合
      const shouldMerge = NON_START_CHARS.test(line) || line.length < 7;
      if (shouldMerge && newMerged.length > 0) {
        const lastLine = newMerged[newMerged.length - 1];
        // より緩い上限（20文字まで）
        if (lastLine.length + line.length <= 20) {
          newMerged[newMerged.length - 1] = lastLine + line;
          changed = true;
          continue;
        }
      }
      newMerged.push(line);
    }
    mergedLines = newMerged;
  }

  // 先頭行が短い場合は次の行と結合
  if (mergedLines.length > 1 && mergedLines[0].length < 6) {
    if (mergedLines[0].length + mergedLines[1].length <= 18) {
      mergedLines[0] = mergedLines[0] + mergedLines[1];
      mergedLines.splice(1, 1);
    }
  }

  return mergedLines;
}

async function main() {
  console.log('形態素解析エンジンを初期化中...');
  const tokenizer = await initTokenizer();
  console.log('初期化完了');

  // セグメント情報を読み込み
  const segments = JSON.parse(fs.readFileSync(SEGMENTS_PATH, 'utf-8'));

  // 各セグメントのテキストを分割
  const segmentsWithTelop = segments.map((segment) => {
    const lines = splitTextWithMorphology(tokenizer, segment.text, MAX_CHARS);
    const lineCount = lines.length;
    const framesPerLine = Math.floor(segment.duration_frames / lineCount);

    // 各行のタイミング情報を計算
    const telopLines = lines.map((line, index) => {
      const startFrame = index * framesPerLine;
      const endFrame = index === lineCount - 1
        ? segment.duration_frames  // 最後の行は残り全部
        : (index + 1) * framesPerLine;

      return {
        text: line,
        startFrame,
        endFrame,
        durationFrames: endFrame - startFrame,
      };
    });

    return {
      ...segment,
      telop_lines: telopLines,
    };
  });

  // 結果を保存
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(segmentsWithTelop, null, 2), 'utf-8');

  console.log('\n=== 分割結果サンプル ===');
  for (let i = 0; i < Math.min(5, segmentsWithTelop.length); i++) {
    const seg = segmentsWithTelop[i];
    console.log(`\nセグメント ${seg.index}: "${seg.text}"`);
    console.log('  分割結果:');
    seg.telop_lines.forEach((line, j) => {
      console.log(`    ${j + 1}. "${line.text}" (${line.startFrame}-${line.endFrame}フレーム)`);
    });
  }

  console.log(`\n合計 ${segmentsWithTelop.length} セグメントを処理しました`);
  console.log(`出力: ${OUTPUT_PATH}`);
}

main().catch(console.error);
