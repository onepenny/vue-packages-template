#!/usr/bin/env node
const glob = require('glob');
const fs = require('fs');
const compiler = require('vue-template-compiler');

const translatePath = `packages/${process.argv[2]}/src/**/*.vue`;

const replaceBetween = (str, start, end, what) =>
  str.substring(0, start) + what + str.substring(end);

// 读取文件翻译数据
const readData = imported => {
  const data = JSON.parse(imported);
  Object.keys(data).forEach(file => {
    const content = fs.readFileSync(file).toString();
    const componentAst = compiler.parseComponent(content);
    componentAst.customBlocks.forEach(i18n => {
      console.log(`updating file ${file}`);
      fs.writeFileSync(
        file,
        replaceBetween(
          content,
          i18n.start,
          i18n.end,
          `\n${JSON.stringify(data[file], null, 2)}\n`
        )
      );
    });
  });
};

// 翻译文件导入
const runImport = () => {
  process.stdin.setEncoding('utf8');

  let importData = '';
  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      importData += chunk;
    }
  });

  process.stdin.on('end', () => {
    readData(importData);
  });
};

// 翻译文件导出
const runExport = fn => {
  glob(translatePath, (_, files) => {
    const out = {};
    files.forEach(file => {
      const componentAst = compiler.parseComponent(
        fs.readFileSync(file).toString()
      );
      componentAst.customBlocks
        .filter(block => block.type === 'i18n')
        .forEach(block => {
          out[file] = JSON.parse(block.content);
        });
    });
    fn ? fn(out) : console.log(JSON.stringify(out, null, 2));
  });
};

switch (process.argv[3]) {
  case 'import':
    runImport();
    break;
  case 'export':
    runExport();
    break;
  default:
    console.log('导出翻译文件：');
    console.log('   yarn run i18n:admin:export');
    console.log('导入翻译文件：');
    console.log('   yarn run i18n:admin:import');
}
