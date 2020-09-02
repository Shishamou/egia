import Queue from './Queue';
import * as utils from './utils';

export default class Egia {
  /**
   * @param  {File} source
   */
  constructor(source) {
    this.queue = new Queue();

    if (source) {
      this.load(source);
    }
  }

  // ===========================================================================
  // = load
  // ===========================================================================

  /**
   * 嘗試讀取檔案
   *
   * @param {*} source
   * @return {*}
   */
  load(source) {
    if (source instanceof File) {
      return this._loadImageFromFile(source);
    }

    throw '輸入必須為檔案';
  }

  /**
   * 載入圖片
   *
   * @param {File} file
   * @return {this}
   */
  _loadImageFromFile(file) {
    if (!/image\/\w+/.test(file.type)) {
      throw '檔案格式必須為圖片類型';
    }

    this._original = file;

    this.queue.push(() => {
      return Promise.resolve(file)
        .then((file) => utils.readFileAsDataURL(file))
        .then((dataURL) => utils.loadImage(dataURL))
        .then((image) => {
          this._resource = utils.makeCanvas(image);
        });
    });

    return this;
  }

  // ===========================================================================
  // = mutations
  // ===========================================================================

  /**
   * @return {HTMLCanvasElement}
   */
  get resource() {
    if (!utils.isCanvas(this._resource)) {
      this._resource = utils.makeCanvas();
    }

    return this._resource;
  }

  /**
   * @param {*}
   * @return {void}
   */
  set resource(value) {
    if (utils.isCanvas(value)) {
      this._resource = value;
    }
  }

  // ===========================================================================
  // = transform
  // ===========================================================================

  /**
   * 給定函式將圖片進行處理
   *
   * @param {Function} handler
   * @param {*} options
   * @return {this}
   */
  transform(handler, options = {}) {
    // 載入已註冊的 transformer
    if (typeof handler === 'string') {
      handler = utils.getTransformer(handler);
    }

    this.queue.push(() => {
      this.resource = handler(this.resource, options);
    });

    return this;
  }

  /**
   * 將圖片縮放以符合大小
   *
   * @param {(number|[number, number])} fit
   * @return {this}
   */
  resize(fit, options = {}) {
    return this.transform('resize', { ...options, fit });
  }

  // ===========================================================================
  // = output
  // ===========================================================================

  /**
   * 輸出為 DataURL 字串
   *
   * See https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
   *
   * @param {string} type
   * @param {*} encoderOptions
   * @return {Promise}
   */
  toDataURL(type, encoderOptions) {
    return this.queue
      .fire()
      .then(() => this.resource.toDataURL(type, encoderOptions));
  }

  /**
   * See https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
   *
   * @param {string} mimeType
   * @param {*} qualityArgument
   * @return {Promise}
   */
  toBlob(mimeType, qualityArgument) {
    return this.queue
      .fire()
      .then(() =>
        utils.transformCanvasToBlob(this.resource, mimeType, qualityArgument)
      );
  }

  /**
   * 輸出為檔案
   *
   * @param {string} mimeType
   * @param {*} qualityArgument
   * @return {Promise}
   */
  toFile(mimeType, qualityArgument) {
    return this.queue
      .fire()
      .then(() => this.toBlob(mimeType, qualityArgument))
      .then((blob) => new File([blob], this.getOriginalFileName()));
  }

  /**
   * @return {string}
   */
  getOriginalFileName() {
    try {
      return this._original.name;
    } catch (e) {
      return 'image';
    }
  }
}
