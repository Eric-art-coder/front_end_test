var time = require('../lib/index');

//匹配器函数：https://jestjs.io/docs/en/expect

describe('time.convertTime', function () {
  it('should throw an error if argument is not a string or number', function() {
    expect(function() {
      time.convertTime(null);
    }).toThrow('error params type');
    expect(function() {
      time.convertTime(true);
    }).toThrow('error params type');
    expect(function() {
      time.convertTime({});
    }).toThrow('error params type');
    expect(function() {
      time.convertTime([]);
    }).toThrow('error params type');
  });

  describe('hms to seconds', function () {
    test(`time.convertTime('aaa') should return 0`, function () {
      expect(time.convertTime('aaa')).toBe(0);
    });

    //练习：时分秒转秒数时，还会出现哪几种数据处理的情况？请对每一种情况写单元测试
    //只考虑传入参数是一个只会由数字或冒号组成的字符串

  });

  describe('seconds to hms', function () {
    test(`time.convertTime(86400) should throw an error`, function() {
      expect(function() {
        time.convertTime(86400);
      }).toThrow('seconds can not be greater than or equal to 86400');
    });

    test(`time.convertTime(-1) should return '00:00:00'`, function() {
      expect(time.convertTime(-1)).toBe('00:00:00');
    });

    //练习：秒数转时分秒时，还会出现哪几种数据处理的情况？请对每一种情况写单元测试

  });
});