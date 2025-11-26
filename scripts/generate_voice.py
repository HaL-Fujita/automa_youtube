#!/usr/bin/env python3
"""
VOICEVOX音声生成スクリプト
ずんだもん（ノーマル）で1.3倍速の音声を生成
"""

import requests
import json
import os
import re
from pathlib import Path

VOICEVOX_URL = "http://localhost:50021"
SPEAKER_ID = 3  # ずんだもん（ノーマル）
SPEED_SCALE = 1.3  # 1.3倍速

def read_script(file_path):
    """台本ファイルを読み込んでセグメントに分割"""
    with open(file_path, 'r', encoding='utf-8-sig') as f:
        content = f.read()

    # 空行で段落を分割し、空でないものだけ取得
    paragraphs = []
    for para in content.split('\n\n'):
        # 各段落の行を結合（改行を除去）
        lines = [line.strip() for line in para.strip().split('\n') if line.strip()]
        if lines:
            text = ''.join(lines)
            # 空白や記号だけの行はスキップ
            if re.sub(r'[\s\*\-\d\.\:：・]+', '', text):
                paragraphs.append(text)

    return paragraphs

def generate_audio(text, output_path, speaker_id=SPEAKER_ID, speed=SPEED_SCALE):
    """VOICEVOXで音声を生成"""
    # 音声合成用のクエリを作成
    query_response = requests.post(
        f"{VOICEVOX_URL}/audio_query",
        params={"text": text, "speaker": speaker_id}
    )
    query_response.raise_for_status()
    query = query_response.json()

    # 速度を設定
    query["speedScale"] = speed

    # 音声合成
    synthesis_response = requests.post(
        f"{VOICEVOX_URL}/synthesis",
        params={"speaker": speaker_id},
        json=query
    )
    synthesis_response.raise_for_status()

    # ファイルに保存
    with open(output_path, 'wb') as f:
        f.write(synthesis_response.content)

    return output_path

def main():
    # パス設定
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent
    daihon_path = project_dir / "src" / "assets" / "daihon.txt"
    output_dir = project_dir / "public" / "audio"

    # 出力ディレクトリ作成
    output_dir.mkdir(parents=True, exist_ok=True)

    # 台本読み込み
    print(f"台本を読み込み中: {daihon_path}")
    segments = read_script(daihon_path)

    print(f"セグメント数: {len(segments)}")
    print(f"話者: ずんだもん（ID: {SPEAKER_ID}）")
    print(f"速度: {SPEED_SCALE}倍速")
    print("-" * 50)

    # 各セグメントの音声を生成
    generated_files = []
    for i, text in enumerate(segments):
        output_path = output_dir / f"segment_{i:03d}.wav"
        print(f"[{i+1}/{len(segments)}] 生成中...")
        print(f"  テキスト: {text[:50]}{'...' if len(text) > 50 else ''}")

        try:
            generate_audio(text, output_path)
            generated_files.append(str(output_path))
            print(f"  保存: {output_path.name}")
        except Exception as e:
            print(f"  エラー: {e}")

    print("-" * 50)
    print(f"完了！ {len(generated_files)}個の音声ファイルを生成しました")
    print(f"出力先: {output_dir}")

    # セグメント情報をJSONで保存
    segments_info = []
    for i, text in enumerate(segments):
        segments_info.append({
            "index": i,
            "text": text,
            "audio_file": f"audio/segment_{i:03d}.wav"
        })

    info_path = output_dir / "segments_info.json"
    with open(info_path, 'w', encoding='utf-8') as f:
        json.dump(segments_info, f, ensure_ascii=False, indent=2)
    print(f"セグメント情報: {info_path}")

if __name__ == "__main__":
    main()
