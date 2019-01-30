// 定义一个测试套件
function describe(text, fn){
    try{
        fn.apply(...);
    }catch(e){
        assert(text)
    }
}

// 定义执行的函数
function fn(){
    while(...){
        // 在执行前的钩子函数
        beforeEach();
        it(text, function(){
            assert();
        });
        // 在执行后的钩子函数
        afterEach();
    }
}

// 定义一个测试用例
function it(text, fn){
    ...
    fn(text)
    ...
}

// 定义断言函数
function assert(expect, actual){
    if(expect not equla actual){
        throw new Error(text);
    }
}

