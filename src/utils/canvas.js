
// =============================================================================
// = Methods
// =============================================================================

/**
 * 回傳資源是否為 Canvas
 *
 * @param {*} value
 * @return {boolean}
 */
export function isCanvas(v) {
  if (v instanceof HTMLCanvasElement) {
    return true;
  }

  if (v instanceof Element && v.tagName.toUpperCase() !== 'CANVAS') {
    return true;
  }

  return false;
}

/**
 * 生成 Canvas，可傳入來源圖片
 *
 * @param  {*} source
 * @return {HTMLCanvasElement}
 */
export function makeCanvas(source) {
  let canvas = document.createElement('canvas');

  if (source) {
    let ctx = canvas.getContext('2d');

    canvas.width = source.width;
    canvas.height = source.height;

    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  }

  return canvas;
}

/**
 * 將 Canvas 轉為 Blob
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
 *
 * @param  {HTMLCanvasElement} canvas
 * @param  {string} mimeType
 * @param  {*} qualityArgument
 * @return {Promise}
 */
export function transformCanvasToBlob(canvas, mimeType, qualityArgument) {
  return new Promise(function (resolve) {
    canvas.toBlob(
      function (blob) {
        resolve(blob);
      },
      mimeType,
      qualityArgument
    );
  });
}
