/**
 * svgr の出力を整形するテンプレート
 * .tsx として出力するためのもの
 */
exports.default = function template(code, config, state) {
  return `
import * as React from 'react';

const ${
    state.componentName
  } = (props: React.SVGAttributes<SVGElement>) => ${code}

export default ${state.componentName};
`.trimLeft();
};
