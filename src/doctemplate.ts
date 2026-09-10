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
    //HeightRule,
  WidthType,
  AlignmentType,
  IBorderOptions,
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

function createRow(words: string[], border: IBorderOptions): TableRow {
  const rows: TableCell[] = [];
  for (const word of words) {
    rows.push(createCell(new TextRun({ text: word }), border));
  }
  return new TableRow({
    children: rows,
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
  const emptyWords = words.map(() => '');
  const pinyinWords = words.map((w) => getPinyin(w));
  return new Table({
    rows: [
      ...(flags.showPinyin ? [createRow(pinyinWords, NoBorder)] : [createRow(emptyWords, border)]),
      ...(flags.showHanzi ? [createRow(words, NoBorder)] : [createRow(emptyWords, border)]),
    ],
      //width: { size: 100, type: WidthType.PERCENTAGE },
      //layout: TableLayoutType.FIXED,
      //height: {
      //value: 2418,
      //rule: HeightRule.EXACTLY,
      //},
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
  const doc = new Document({
    sections: [
      {
        children: rows.map((r) => createTable(r, flags)),
      },
    ],
  });

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync('MoZhiBorders.docx', buffer);
    console.log('MoZhi生成成功！');
  });
}
