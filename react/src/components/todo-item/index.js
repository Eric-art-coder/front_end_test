import React from 'react';

export default class TodoItem extends React.Component {
  constructor(props) {
    super(props)
  }

  del = () => {
    const { todo, deleteTodo } = this.props;
    deleteTodo(todo.id);
  }

  render() {
    const { todo } = this.props;
    return (
      <div>
        <input type="checkbox" checked={todo.completed} onChange={this.del} />
        <span className="todo-title">{todo.text}</span>
      </div>
    );
  }
}