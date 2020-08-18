/**
 * cursor/*.png を base64 にコンバートして
 * cursor/index.ts に変数として書き出す
 */

const fs = require('fs');
const path = require('path');

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

fs.writeFileSync(path.join(cursorsDir, 'index.ts'), content);
