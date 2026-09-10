import * as readline from 'readline';
import { exportDoc } from './doctemplate.ts';

// 创建命令行读取接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const MAX_IN_A_ROW: number = 10;

function word2rows(input: string): string[][] {
  const words = input.split(' ').filter((word) => word.length > 0);

  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
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
rl.question('请输入一大串汉字: ', (answer) => {
  if (answer.trim()) {
    rows = word2rows(answer);
    exportDoc(rows, { showPinyin: true, showHanzi: true });
  } else {
    console.log('\n no input content.');
  }
  rl.close();
});
