import * as readline from 'readline';
import { pinyin } from 'pinyin-pro';

export function getPinyin(text: string): string {
  return pinyin(text, { toneType: 'symbol', type: 'array' }).join(' ');
}

console.log(getPinyin('你好世界'));

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
} from 'docx';
import * as fs from 'fs';

// 1. 定义几种不同的边框样式
const defaultBorder = { style: BorderStyle.SINGLE, size: 4, color: '999999' }; // 默认细灰线
const thickBorder = { style: BorderStyle.SINGLE, size: 12, color: '000000' }; // 粗黑线
const redDashedBorder = { style: BorderStyle.DASHED, size: 8, color: 'FF0000' }; // 红色虚线
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }; // 无边框

// 2. 构建表格行和单元格
const rows: TableRow[] = [];

// 第一行：表头（使用粗边框）
rows.push(
  new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: '姓名', bold: true })],
          }),
        ],
        borders: {
          top: thickBorder,
          bottom: thickBorder,
          left: thickBorder,
          right: thickBorder,
        }, // 单独设置四周边框
      }),
      new TableCell({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: '成绩', bold: true })],
          }),
        ],
        borders: {
          top: thickBorder,
          bottom: thickBorder,
          left: thickBorder,
          right: thickBorder,
        },
      }),
    ],
  })
);

// 第二行：普通数据（使用默认细边框）
rows.push(
  new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun('张三' + getPinyin('张三'))],
          }),
        ],
        borders: {
          top: defaultBorder,
          bottom: defaultBorder,
          left: defaultBorder,
          right: defaultBorder,
        },
      }),
      new TableCell({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun(getPinyin('你好粗糙'))],
          }),
        ],
        // 这个单元格单独使用红色虚线边框
        borders: {
          top: redDashedBorder,
          bottom: redDashedBorder,
          left: redDashedBorder,
          right: redDashedBorder,
        },
      }),
    ],
  })
);

// 第三行：特殊单元格（例如左侧无边框，右侧粗边框）
rows.push(
  new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun('李四')],
          }),
        ],
        borders: {
          top: defaultBorder,
          bottom: defaultBorder,
          left: noBorder,
          right: defaultBorder,
        },
      }),
      new TableCell({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun('88')],
          }),
        ],
        borders: {
          top: defaultBorder,
          bottom: defaultBorder,
          left: defaultBorder,
          right: thickBorder,
        },
      }),
    ],
  })
);

// 3. 实例化表格
// 注意：这里依然可以给 Table 设置一个默认的 borders，作为没有单独设置边框的单元格的“兜底”
const table = new Table({
  rows: rows,
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

// 4. 生成文档
const doc = new Document({ sections: [{ children: [table] }] });
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('CustomCellBorders.docx', buffer);
  console.log('个性化边框文档生成成功！');
});

// 2. 创建命令行读取接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 3. 提示用户输入
rl.question('请输入一大串汉字: ', (answer) => {
  if (answer.trim()) {
    const result = getPinyin(answer);
    console.log('\n✨ 转换结果:\n', result);
  } else {
    console.log('\n⚠️ 你没有输入任何内容。');
  }
  
  // 4. 输出结果后，直接关闭程序
  rl.close();
});
