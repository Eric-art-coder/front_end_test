const fakeData = [
  {
    id: 1,
    name: '陈同学',
    lesson: '语文',
    ts: 1599079121404
  },
  {
    id: 2,
    name: '李同学',
    lesson: '数学',
    ts: 1551079121404
  },
  {
    id: 3,
    nane: '张同学',
    lesson: '英语',
    ts: 1560079121404
  },
  {
    id: 4,
    nane: '曾同学',
    lesson: '社会与自然',
    ts: 1595079121404
  }
];

export default function getFakeData(params) {
  return new Promise(resolve => {
    const data = fakeData.filter(item => item.ts >= params.ts);
    resolve(data);
  });
}