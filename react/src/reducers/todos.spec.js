import todos from './todos';
import * as types from '../constants';

describe('todos reducer', () => {
  it('should handle initial state', () => {
    const state = todos(undefined, {});
    expect(state).toEqual([
      {
        text: 'Todo1',
        completed: false,
        id: 0
      }
    ]);
  });

  //练习：如果接受到type为 ADD_TODO 的action的话，state会 unshift 一个新todo对象（返回新的state）
  it('should handle ADD_TODO', () => {

  });

  //练习：如果接受到type为 DELETE_TODO 的action的话，state会删除对应id的todo对象（返回新的state）
  it('should handle DELETE_TODO', () => {

  });
});