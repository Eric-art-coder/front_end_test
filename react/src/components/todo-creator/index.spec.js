import React from 'react';
import TestRenderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import TodoCreator from './index';

describe('TodoCreator Component', () => {
  const compProps = {
    //https://jestjs.io/docs/en/mock-functions
    addTodo: jest.fn()
  };
  const wrapper = shallow(
    <TodoCreator { ...compProps } />
  );

  //https://jestjs.io/docs/en/setup-teardown
  afterEach(() => {
    //https://jestjs.io/docs/en/jest-object#jestclearallmocks
    jest.clearAllMocks();
  });

  //https://jestjs.io/docs/en/snapshot-testing
  it('should render elements correctly', () => {
    const snapshot = TestRenderer
      .create(
        <TodoCreator />
      )
      .toJSON();
    //https://jestjs.io/docs/en/expect
    expect(snapshot).toMatchSnapshot();
  });

  describe('user presses "Enter" key', () => {
    it('should do nothing if input is empty', () => {
      const event = {
        target: {
          value: null
        },
        key: 'Enter'
      };
      wrapper.find('input').simulate('keydown', event);
      expect(compProps.addTodo).not.toHaveBeenCalled();
      expect(event.target.value).toBeNull();
    });

    //练习：如果用户有输入，当用户按下 Enter 键时调用props.addTodo并清除输入框
    it('should call "addTodo" and clear input if input is not empty', () => {

    });
  });
});