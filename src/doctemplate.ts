import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  BorderStyle,
  TableLayoutType,
  HeightRule,
  WidthType,
  AlignmentType,
  IBorderOptions,
  convertMillimetersToTwip,
} from 'docx';

import { pinyin } from 'pinyin-pro';

function getPinyin(text: string): string {
  return pinyin(text, { toneType: 'symbol', type: 'array' }).join(' ');
}

import * as fs from 'fs';

// 定义边框样式
const DefaultBorder = { style: BorderStyle.SINGLE, size: 4, color: '999999' }; // 默认细灰线
const ThickBorder = { style: BorderStyle.SINGLE, size: 12, color: '000000' }; // 粗黑线
const RedDashedBorder = { style: BorderStyle.DASHED, size: 8, color: 'FF0000' }; // 红色虚线
const NoBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }; // 无边框

function createCell(run: TextRun, border: IBorderOptions): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [run],
      }),
    ],
    //width: { size: run.text ? run.text.length * 12 : 12, type: WidthType.PERCENTAGE },
    borders: {
      top: border,
      bottom: border,
      left: border,
      right: border,
    },
  });
}

function createRow(words: string[], border: IBorderOptions, size: number = 28): TableRow {
  const rows: TableCell[] = [];
  for (const word of words) {
    rows.push(createCell(new TextRun({ text: word, size: size }), border));
  }
  return new TableRow({
    children: rows,
    height: {
      value: convertMillimetersToTwip(1.4),
      rule: HeightRule.EXACTLY,
    },
  });
}

interface PinyinFlags {
  showPinyin: boolean;
  showHanzi: boolean;
}

function createTable(
  words: string[],
  flags: PinyinFlags,
  border: IBorderOptions = DefaultBorder
): Table {
  const emptyWords = words.map(() => '\u200B');
  const pinyinWords = words.map((w) => getPinyin(w));
  return new Table({
    rows: [
      ...(flags.showPinyin ? [createRow(pinyinWords, NoBorder)] : [createRow(emptyWords, border)]),
      ...(flags.showHanzi ? [createRow(words, NoBorder)] : [createRow(emptyWords, border)]),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: DefaultBorder,
      bottom: DefaultBorder,
      left: DefaultBorder,
      right: DefaultBorder,
      insideHorizontal: DefaultBorder,
      insideVertical: DefaultBorder,
    },
  });
}

export function exportDoc(rows: string[][], flags: PinyinFlags) {
  const section_children = [];
  for (const row of rows) {
    section_children.push(createTable(row, flags));
    section_children.push(new Paragraph({ text: '' }));
  }

  const doc = new Document({
    sections: [
      {
        children: section_children,
      },
    ],
  });

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(`mozhi_${Date.now()}.docx`, buffer);
    console.log('docx generated!');
  });
}
