import * as readline from 'readline';
import { pinyin } from 'pinyin-pro';
import { exportDoc } from './doctemplate.ts';

export function getPinyin(text: string): string {
  return pinyin(text, { toneType: 'symbol', type: 'array' }).join(' ');
}

console.log(getPinyin('你好世界'));

// 创建命令行读取接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const MAX_IN_A_ROW: number = 8;

// 提示用户输入
rl.question('请输入一大串汉字: ', (answer) => {
    
  if (answer.trim()) {
    const result = getPinyin(answer);
    console.log('\n result::\n', result);
  } else {
    console.log('\n no input content.');
  }
    // split whitespace to array
    // reorder to lines
    // choose type
    // export by lines
  rl.close();
});
