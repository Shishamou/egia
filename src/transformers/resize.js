import { makeCanvas } from '../utils';

export default function (source, options = {}) {
  let { fit, imageSmoothingQuality } = options;

  let [destWidth, destHeight] = calcDestinationSize(source, fit);

  let canvas = makeCanvas();
  let ctx = canvas.getContext('2d');

  canvas.width = destWidth;
  canvas.height = destHeight;

  if (imageSmoothingQuality) {
    ctx.imageSmoothingQuality = imageSmoothingQuality;
  }

  ctx.drawImage(source, 0, 0, destWidth, destHeight);

  return canvas;
}

/**
 * 計算圖片長寬尺寸
 *
 * @param  {*} source
 * @param  {*} fit
 * @return {[number, number]}
 *
 * @example
 *
 * calcDestinationSize({width: 1600, height: 900}, 800)
 * // => [800, 450]
 *
 * calcDestinationSize({width: 1600, height: 900}, [800, 400])
 * // => [711, 400]
 *
 * calcDestinationSize({width: 600, height: 400}, 800)
 * // => [600, 400]
 */
function calcDestinationSize(source, fit) {
  fit = resolveFitOption(fit);

  if (!fit) {
    return [source.width, source.height];
  }

  let [fitWidth, fitHeight] = fit;
  let sourceWidth = source.width;
  let sourceHeight = source.height;

  // 若圖片長寬都在規定範圍內，則不計算縮放直接回傳結果
  if (sourceWidth <= fitWidth && sourceHeight <= fitHeight) {
    return [sourceWidth, sourceHeight];
  }

  // 計算最適合的縮放倍率，倍率越小代表圖片要縮的越小
  let scaleWidth = fitWidth / sourceWidth;
  let scaleHeight = fitHeight / sourceHeight;

  let destScale = Math.min(scaleWidth, scaleHeight);

  // 計算最終的圖片長寬
  let destWidth = Math.round(sourceWidth * destScale);
  let destHeight = Math.round(sourceHeight * destScale);

  destWidth = Math.min(fitWidth, destWidth);
  destHeight = Math.min(fitHeight, destHeight);

  return [destWidth, destHeight];
}

/**
 * 嘗試解析 fit 參數，若無法處理則回傳 null
 *
 * @param  {*} fit
 * @return {([number, number]|null)}
 */
function resolveFitOption(fit) {
  if (Number.isInteger(fit)) {
    return [fit, fit];
  }

  if (Array.isArray(fit)) {
    if (fit.length !== 2) {
      throw `fit 參數長度必須等於 2`;
    }

    return fit;
  }

  return null;
}
