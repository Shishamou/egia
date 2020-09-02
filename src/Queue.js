
export default class Queue {
  constructor() {
    this.jobs = [];
    this.fired = false;
  }

  /**
   * 增加任務到對列
   *
   * @param {function} job
   */
  push(job) {
    if (typeof job === 'function') {
      this.jobs.push(job);
      return;
    }

    throw `參數必須為 callable`;
  }

  /**
   * 逐一觸發對列中的所有任務。
   *
   * @param {*} data
   * @return {Promise}
   */
  fire(data) {
    this.fired = true;

    let process = Promise.resolve(data);

    return this.jobs.reduce(function (process, job) {
      return process.then(job);
    }, process);
  }
}
