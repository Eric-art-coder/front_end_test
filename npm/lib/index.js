/**
 * 一天的最大秒数
 */
var SECONDS_OF_DAY = 86400;

/**
 * 秒数转时分秒形式或者时分秒转为秒数
 * @param {number} _timeValue 秒数
 */
function convertTime(_timeValue) {
  if (typeof _timeValue === 'string') { //传入的是时分秒 转为 秒数
    if (/\:/.test(_timeValue)) {
      var tempArr = _timeValue.split(':');
      switch (tempArr.length) {
        case 3:
          return parse(tempArr[0]) * 60 * 60 + parse(tempArr[1]) * 60 + parse(tempArr[2]);
        case 2:
          return parse(tempArr[0]) * 60 + parse(tempArr[1]);
        default:
          return 0;
      }
    } else {
      _timeValue = parseInt(_timeValue);
      return _timeValue > 0 ? _timeValue : 0;
    }
  } else if (typeof _timeValue === 'number') { //传入的是 秒数转为 时分秒
    _timeValue = parseInt(_timeValue);
    if(_timeValue >= SECONDS_OF_DAY) {
      throw new Error('seconds can not be greater than or equal to ' + SECONDS_OF_DAY);
    } else if (_timeValue >= 0) {
      var hours = parseInt(_timeValue / 3600);
      var minutes = parseInt(_timeValue % 3600 / 60);
      var seconds = parseInt(_timeValue % 60);
      return hours > 0
        ? `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
        : `00:${padZero(minutes)}:${padZero(seconds)}`;
    } else {
      return '00:00:00';
    }
  } else {
    throw new Error('error params type');
  }
}

/**
 * 转为数字
 * @param {string} str
 */
function parse(str) {
  return +str || 0;
}

/**
 * 补零
 * @param {string} str
 */
function padZero(str) {
  return /^\d$/g.test(str) ? `0${str}` : str;
}

module.exports = {
  convertTime: convertTime
}