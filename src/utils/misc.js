import path from 'path';

const transformers = {};

let req = require.context('../transformers', true, /\.js$/i);

req.keys().forEach(function (file) {
  transformers[path.basename(file, '.js')] = req(file).default;
});

// =============================================================================
// = Methods
// =============================================================================

/**
 * 取得指定名稱的圖片處理器
 *
 * @param {string} name
 * @return {Function}
 * @throws 當找不到時拋錯
 */
export function getTransformer(name) {
  if (typeof transformers[name] === 'undefined') {
    throw `找不到指定的圖片處理器: ${name}`;
  }

  return transformers[name];
}
