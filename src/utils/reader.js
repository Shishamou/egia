
// =============================================================================
// = Methods
// =============================================================================

/**
 * 讀取檔案。透過 FileReader 讀取指定檔案。
 *
 * @param  {File} file
 * @return {Promise}
 */
export function readFileAsDataURL(file) {
  return new Promise(function (resolve) {
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result);
    };
  });
}

/**
 * 載入圖片
 *
 * @param  {*} src
 * @return {Promise}
 */
export function loadImage(source) {
  return new Promise(function (resolve) {
    let image = new Image();

    image.src = source;
    image.onload = function () {
      resolve(image);
    };
  });
}
