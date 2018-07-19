/**
 * svgr の出力を整形するテンプレート
 * .tsx として出力するためのもの
 * props に type を与えれば入力補完が得られる
 */
exports.default = function template(code, config, state) {
  return `
import * as React from 'react';

const ${state.componentName} = (props: any) => ${code}

export default ${state.componentName};
`.trimLeft();
};
