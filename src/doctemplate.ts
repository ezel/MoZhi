import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  BorderStyle,
  WidthType,
  AlignmentType,
  IBorderOptions,
} from 'docx';
import * as fs from 'fs';

// 1. 定义几种不同的边框样式
const defaultBorder = { style: BorderStyle.SINGLE, size: 4, color: '999999' }; // 默认细灰线
const thickBorder = { style: BorderStyle.SINGLE, size: 12, color: '000000' }; // 粗黑线
const redDashedBorder = { style: BorderStyle.DASHED, size: 8, color: 'FF0000' }; // 红色虚线
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }; // 无边框

function createCell(run: TextRun, border: IBorderOptions): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [run],
      }),
    ],
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

function createTable(words: string[], border: IBorderOptions): Table {
  const emptyWords = words.map(() => '');
  return new Table({
    rows: [createRow(words, border), createRow(emptyWords, border)],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: defaultBorder,
      bottom: defaultBorder,
      left: defaultBorder,
      right: defaultBorder,
      insideHorizontal: defaultBorder,
      insideVertical: defaultBorder,
    },
  });
}

export function exportDoc() {
  const doc = new Document({
    sections: [
      {
        children: [
          createTable(['1', '2', '3'], thickBorder),
          createTable(['2222', '333333'], defaultBorder),
        ],
      },
    ],
  });

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync('CustomCellBorders.docx', buffer);
    console.log('个性化边框文档生成成功！');
  });
}
