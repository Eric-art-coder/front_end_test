var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

// 添加测试
suite
.add('RegExp#test', test1)
.add('String#indexOf', test2)
.on('cycle', cycleFn)
.on('complete', complete)
.run({ 'async': true });

function test1(){
    /o/.test('Hello World!');
}

function test2(){
    'Hello World!'.indexOf('o') > -1;
}

function cycleFn(event){
    console.log(String(event.target));
}

function complete(){
    console.log('完成了')
}