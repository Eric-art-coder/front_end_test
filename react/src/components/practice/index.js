import React from 'react';
import { connect } from 'react-redux';

import getFakeData from './getFakeData';
import {
  DateQuery,
  Item,
  EmptyDataPrompt
} from './components';

export class Practice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ''
    };
  }

  query = async ts => {
    if(this.state.items) {
      this.setState({ item: '' });
    }
    const items = await getFakeData({ ts });
    this.setState({ items });
    this.props.dispatch({
      type: 'PRACTICE_ITEMS',
      data: items
    });
  }

  render() {
    const { items } = this.state;
    return (
      <div className="container">
        <DateQuery onQuery={ this.query } />
        <div className="view">
          {
            items ? items.map(item => (
              <Item key={ item.id } { ...item } />
            )) : null
          }
          { items && !items.length ? <EmptyDataPrompt /> : null }
        </div>
      </div>
    );
  }
}

export default connect()(Practice)
