/**
 * cursor/*.png を base64 にコンバートして
 * cursor/index.ts に変数として書き出す
 */

const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const cursorsDir = path.resolve(__dirname, './src/cursors');

const fileNames = fs.readdirSync(cursorsDir);
const content = fileNames.reduce((content, fileName) => {
  const { name, ext } = path.parse(fileName);
  if (ext !== '.png') return content; // nope!

  const base64 = fs.readFileSync(path.join(cursorsDir, fileName), {
    encoding: 'base64'
  });
  return (
    content + `export const ${name} = 'data:image/png;base64,${base64}';\n`
  );
}, '');

const prettierrc = fs.readFileSync(
  path.resolve(__dirname, './.prettierrc'),
  'utf-8'
);
const prettierOption = JSON.parse(prettierrc);
const filepath = path.join(cursorsDir, 'index.ts');
fs.writeFileSync(
  filepath,
  prettier.format(content, {
    ...prettierOption,
    filepath
  })
);
