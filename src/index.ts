import * as readline from 'readline';
import { exportDoc } from './doctemplate.ts';

// 创建命令行读取接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const MAX_IN_A_ROW: number = 14;

function word2rows(input: string, inOrder: boolean = false): string[][] {
  const words = input.split(/[\s\n\r\t]+/).filter((word) => word.length > 0);
  if (!inOrder) {
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
  }

  const result: string[] = [];
  let currentLine: string[] = [];
  let currentLength = 0;

  for (const word of words) {
    if (word.length >= MAX_IN_A_ROW) {
      result.push(word);
      continue;
    }
    const spaceNeeded = currentLine.length > 0 ? 1 : 0;
    if (currentLength + spaceNeeded + word.length <= MAX_IN_A_ROW) {
      // join into line
      currentLine.push(word);
      currentLength += spaceNeeded + word.length;
    } else {
      // new line
      result.push(currentLine);
      currentLine = [word];
      currentLength = word.length;
    }
  }
  if (currentLine.length > 0) {
    result.push(currentLine);
  }
  return result;
}

// 提示用户输入
var status = {
  inOrder: false,
  showPinyin: true,
  showHanzi: false,
  twoSided: false,
};

rl.question(
  '依次输入[inOrder, showPinyin, showHanzi, twoSided], 默认为[0, 1, 0, 0]:\n',
  (answer) => {
    answer.trim();
    const res = answer.split(/[\s\n\r\t]+/);
    if (res[0] && (res[0] === '1' || res[0] === 'true')) {
      status.inOrder = true;
    }
    if (res[1] && (res[1] === '1' || res[1] === 'true')) {
      status.showPinyin = true;
    }
    if (res[2] && (res[2] === '1' || res[2] === 'true')) {
      status.showHanzi = true;
    }
    console.log(status);
    rl.question('请输入一大串汉字:\n', (answer) => {
      if (answer.trim()) {
        rows = word2rows(answer, status.inOrder);
        exportDoc(
          rows,
          { showPinyin: status.showPinyin, showHanzi: status.showHanzi },
          `mozhi_${Date.now()}.docx`
        );
      } else {
        console.log('\n no input content.');
      }
      rl.close();
    });
  }
);
