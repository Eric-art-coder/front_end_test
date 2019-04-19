module.exports = {
  bail: false,
  // notify: true,
  verbose: true,
  testEnvironment: 'node',
  //匹配相关的测试文件
  testMatch: ['/**/?(*.)+(test).(j|t)s?(x)'],
  //忽略规则
  testPathIgnorePatterns: ['/node_modules/', '/source/', '/sourceV2/']
};
