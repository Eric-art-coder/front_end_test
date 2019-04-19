import React from 'react';
import { shallow } from 'enzyme';

import { photoTypes } from './types';
import { Photo } from './index';
import {
  SubNavBar,
  DragRefresher,
  PullRefresher
} from './components';

//https://jestjs.io/docs/en/manual-mocks#using-with-es-module-imports
//Jest会自动将jest.mock的调用提升到模块顶部（在任何import之前）
jest.mock('./Http', () => {
  mockHttpPost = jest.fn();
  return {
    post: mockHttpPost
  };
});

//利用变量提升特性来解决“Http.post的mock函数无法被单元测试使用”的问题
var mockHttpPost;

describe('Photo Component', () => {
  let wrapper = null;

  const mockDispatch = jest.fn();
  const mockPullRefresherComponent = {
    reset: jest.fn()
  };
  const mockDragRefresherComponent = {
    complete: jest.fn()
  };

  //浅渲染并不会执行组件或元素的ref函数，需要自己手动设置
  //在原有组件的基础上再扩展一个PhotoWrapper组件
  class PhotoWrapper extends Photo {
    constructor(props) {
      super(props);
      this.PullRefresherComponent = mockPullRefresherComponent;
      this.DragRefresherComponent = mockDragRefresherComponent;
    }
  }

  //利用事件循环中的task和microtask，单元测试可以等待组件内的promises执行完毕
  //https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
  function flushPromises() {
    return new Promise(function(resolve) {
      setImmediate(resolve);
    });
  }

  //在走数据请求流程之前，对一些关键测试点进行断言
  function validationsBeforeDispatch() {
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockHttpPost).not.toHaveBeenCalled();
    expect(mockPullRefresherComponent.reset).not.toHaveBeenCalled();
    if(wrapper) {
      const snapshot = wrapper.get(0);
      expect(snapshot).toMatchSnapshot();
    }
  }

  //在数据请求流程走完之后，对一些关键测试点进行断言
  function validationsAfterDispatch(dispatchCalledTimes) {
    expect(mockDispatch).toHaveBeenCalledTimes(dispatchCalledTimes);
    expect(mockHttpPost).toHaveBeenCalledTimes(1);
    expect(mockPullRefresherComponent.reset).toHaveBeenCalledTimes(1);
    if(wrapper) {
      const snapshot = wrapper.get(0);
      expect(snapshot).toMatchSnapshot();
    }
  }

  //模拟一次接口请求返回的数据
  function mockHttpPostImplementation(customData) {
    mockHttpPost.mockImplementationOnce(() => Promise.resolve({
      data: customData || {
        list: [{ id: 1 }, { id: 2 }, { id: 3 }],
        totalPage: 1,
        pageSize: 10
      }
    }));
  }

  //模拟dispatch操作的内部实现
  function mockDispatchImplementation(...dispatchTypes) {
    if(!dispatchTypes.length) {
      dispatchTypes.push('pagination');
    }

    dispatchTypes.forEach(dispatchType => {
      switch(dispatchType) {
        //更新查询条件
        case 'condition':
          mockDispatch.mockImplementationOnce(action => {
            wrapper.setProps({
              condition: {
                ...wrapper.instance().props.condition,
                ...action.data
              }
            });
          });
          break;
        //更新分页信息
        case 'pagination':
          mockDispatch.mockImplementationOnce(action => {
            wrapper.setProps({
              pagination: {
                list: action.list,
                totalPage: action.totalPage
              }
            });
          });
          break;
      }
    });
  }

  beforeEach(() => {
    const componentProps = {
      classDetail: {
        id: 1
      },
      condition: {
        pageIndex: 1,
        pageSize: 10,
        classId: 1,
        photoTypeId: photoTypes[0].id
      },
      pagination: {
        list: null,
        totalPage: 0
      },
      dispatch: mockDispatch
    };
    //对组件进行测试时，大部分情况下都应该使用浅渲染
    wrapper = shallow(
      <PhotoWrapper { ...componentProps } />,
      {
        //设为true时，组件不会触发componentDidMount
        disableLifecycleMethods: true
      }
    );
  });

  //清除相关状态
  afterEach(() => {
    wrapper.unmount();
    wrapper = null;
    jest.clearAllMocks();
  });

  it('should reacquire photos after changing class', async () => {
    validationsBeforeDispatch();
    mockHttpPostImplementation();

    //模拟切换班级操作
    wrapper.setProps({
      classDetail: {
        id: 2
      }
    });

    mockDispatchImplementation();
    await flushPromises();
    validationsAfterDispatch(3);
  });

  it('should reacquire photos after changing photo type', async () => {
    validationsBeforeDispatch();
    mockHttpPostImplementation();
    mockDispatchImplementation('condition');

    //模拟切换图片类型
    wrapper.find(SubNavBar).simulate('choose', photoTypes[1].id);

    mockDispatchImplementation();
    await flushPromises();
    validationsAfterDispatch(3);
  });

  it('should update photos after triggering DragRefresher.onRefresh', async () => {
    expect(mockDragRefresherComponent.complete).not.toHaveBeenCalled();
    validationsBeforeDispatch();
    mockHttpPostImplementation();
    mockDispatchImplementation();

    //模拟下拉刷新操作
    wrapper.find(DragRefresher).simulate('refresh');

    await flushPromises();
    validationsAfterDispatch(2);
    expect(mockDragRefresherComponent.complete).toHaveBeenCalledTimes(1);
  });

  it('should load more photos after triggering PullRefresher.onRefresh', async () => {
    const list = [];
    for(let i = 1; i <= 10; i++) {
      list.push({ id: i });
    }

    wrapper.setProps({
      pagination: {
        list,
        totalPage: 2
      }
    });

    validationsBeforeDispatch();
    mockHttpPostImplementation({
      list: [{ id: 11 }, { id: 12 }, { id: 13 }],
      totalPage: 2,
      pageSize: 10
    });
    mockDispatchImplementation('pagination', 'condition');

    //模拟分页加载
    wrapper.find(PullRefresher).simulate('refresh');

    await flushPromises();
    validationsAfterDispatch(2);
  });
});