import React from 'react';
// import './index.scss';

export default class TodoCreator extends React.Component {
  constructor(props) {
    super(props);
  }

  onKeydownHandle = ev => {
    const value = ev.target.value;
    if (ev.key === 'Enter' && value) {
      this.props.addTodo(ev.target.value);
      ev.target.value = '';
    }
  }

  render() {
    return (
      <div>
        <input type="text" onKeyDown={this.onKeydownHandle} />
      </div>
    );
  }
}